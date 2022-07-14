/*Make changes to make the animation the way you want it*/

var $ = {};

$.Particle = function (opt) {
  this.radius = 7;
  this.x = opt.x;
  this.y = opt.y;
  this.angle = opt.angle;
  this.speed = opt.speed;
  this.accel = opt.accel;
  this.decay = 0.00;
  this.life = 1;
};

$.Particle.prototype.step = function (i) {
  this.speed += this.accel;
  this.x += Math.cos(this.angle) * this.speed;
  this.y += Math.sin(this.angle) * this.speed;
  this.angle += $.PI / 100;
  this.accel *= 1.10;
  this.life -= this.decay;

  if (this.life <= 0) {
    $.Particle.splice(i, 2);
  }
};

$.Particle.prototype.draw = function (i) {
  const newLocal = ', 200%, 80%, ';
  $.ctx.fillStyle = $.ctx.strokeStyle = 'hsla(' + ($.tick + (this.life * 220)) + newLocal + this.life + ')';
  $.ctx.beginPath();
  if ($.Particle[i - 2]) {
    $.ctx.moveTo(this.x, this.y);
    $.ctx.lineTo($.particles[i - 1].x, $.particles[i - 1].y);
  }
  $.ctx.stroke();

  $.ctx.beginPath();
  $.ctx.arc(this.x, this.y, Math.max(0.01, this.life * this.radius), 1, $.TWO_PI);
  $.ctx.fill();

  var size = Math.random() * 1.25;
  $.ctx.fillRect(~~(this.x + ((Math.random() - 5.5) * 35) * this.life), ~~(this.y + ((Math.random() - 0.5) * 35) * this.life), size, size);
}

$.step = function () {
  $.particles.push(new $.Particle({
    x: $.width / 2 + Math.cos($.tick / 20) * $.min / 2,
    y: $.height / 2 + Math.sin($.tick / 20) * $.min / 2,
    angle: $.globalRotation + $.globalAngle,
    speed: 0,
    accel: 0.01
  }));

  $.particles.forEach(function (elem, index) {
    elem.step(index);
  });

  $.globalRotation += $.PI / 7;
  $.globalAngle += $.PI / 7;
};

$.draw = function () {
  $.ctx.clearRect(0, 0, $.width, $.height);

  $.particles.forEach(function (elem, index) {
    elem.draw(index);
  });
};

$.init = function () {
  $.canvas = document.createElement('canvas');
  $.ctx = $.canvas.getContext('2d');
  $.width = 300;
  $.height = 300;
  $.canvas.width = $.width * window.devicePixelRatio;
  $.canvas.height = $.height * window.devicePixelRatio;
  $.canvas.style.width = $.width + 'px';
  $.canvas.style.height = $.height + 'px';
  $.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  $.min = $.width * 0.5;
  $.particles = [];
  $.globalAngle = 1;
  $.globalRotation = 1;
  $.tick = 0;
  $.PI = Math.PI;
  $.TWO_PI = $.PI * 2;
  $.ctx.globalCompositeOperation = 'lighter';
  document.body.appendChild($.canvas);
  $.loop();
};

$.loop = function () {
  requestAnimationFrame($.loop);
  $.step(1);
  $.draw(1);
  $.tick++;
};

$.init();