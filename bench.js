var child_process = require('child_process');
var files = child_process.execSync('find src -name "*_bench.js"').toString("utf-8").split(/\r\n|\r|\n/);

function Benchmark(message, iterations, fn) {
  this.message = message;
  this.iterations = iterations;
  this.fn = fn;
  this.duration = 0;
  this.done = 0;
}

Benchmark.prototype.runSample = function() {
  var iterations = Math.ceil(this.iterations/10);
  var start = +new Date;
  for(var i=0; i<iterations && this.done < this.iterations; i++)
    this.fn(this.done++);
  this.duration += (+new Date) - start;
};

Benchmark.prototype.isDone = function() {
  return this.done >= this.iterations;
}

function fmtDuration(ms) {
  if(ms > 100)
    return (ms / 1000).toFixed(2) + 's ';
  else if(ms < 0.0001)
    return (ms * 1000000).toFixed(2) + 'ns';
  else if(ms < 0.1)
    return (ms * 1000).toFixed(2) + 'µs';
  else
    return (ms).toFixed(2) + 'ms';
}

function fmtDurationLog10(ms) {
  return Math.log10(ms * 1e6);
}

function rpad(str, len) {
  return str + (new Array(Math.max(0, len - str.length))).join(' ');
}

function lpad(str, len) {
  return (new Array(Math.max(0, len - str.length))).join(' ') + str;
}

Benchmark.prototype.report = function() {
  return rpad(this.message, 60)+' '
    +lpad('x'+this.done, 12)
    +' - sum: '+lpad(fmtDuration(this.duration), 8)
    +' - avg: '+lpad(fmtDuration(this.duration/this.done), 8)
    +' - e: '+lpad(fmtDurationLog10(this.duration/this.done).toFixed(2), 6);
};

var benchmarks = [];
global.benchmark = function(message, iterations, fn) {
  benchmarks.push(new Benchmark(message, iterations, fn));
};

for(var i=0, file; file = files[i]; i++)
  if(file.length > 0)
    require(file.substr('src/'.length));

function calculateProgress() {
  var sum = benchmarks.length + doneBenchmarks.length;
  var done = doneBenchmarks.length;
  for(var i=0, bench; bench = benchmarks[i]; i++)
    done += bench.done/bench.iterations;
  return done/sum;
}

function renderProgress() {
  var BAR_LEN = 64;
  var progress = Math.floor(calculateProgress()*BAR_LEN);
  process.stdout.write('\r' + new Array(BAR_LEN+1).join('-'));
  process.stdout.write('\r' + new Array(progress+1).join('='));
}

var doneBenchmarks = [];

while(benchmarks.length) {
  var i = Math.floor(Math.random() * benchmarks.length);
  var randomBenchmark = benchmarks[i];
  randomBenchmark.runSample();
  renderProgress();
  if(randomBenchmark.isDone()) {
    benchmarks.splice(i, 1);
    doneBenchmarks.push(randomBenchmark);
  }
}
console.log('');

var reports = new Array(doneBenchmarks.length);
for(var i=0; i<doneBenchmarks.length; i++)
  reports[i] = doneBenchmarks[i].report();

reports.sort();
for(var i=0; report = reports[i]; i++)
  console.log(report);
