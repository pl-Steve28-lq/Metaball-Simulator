import { BaseCanvasApp } from './BaseApp.js'

import { Ball } from './Ball.js'

class App extends BaseCanvasApp {
  constructor() { super() }

  init() {
    super.init()
    this.b = []
    for (let i = 0; i < 8; i++) {
      this.b.push(
        new Ball(2*Math.random(), Math.random(), 0.3+0.2*Math.random(), this.Width, this.Height, 2-4*Math.random(), 2-4*Math.random())
      )
    }
    this.ctx.lineWidth = 2
  }

  f(x, y) {
    return this.b.map(b => b.r/b.dist(x, y)).reduce((a, b) => a+b)
  }

  animate() {
    super.animate()
    this.b.forEach(b => b.move())
    let x = X, y = Y,
        w = this.Width/x, h = this.Height/y
    for (let i = 0; i < x; i++)
      for (let j = 0; j < y; j++)
        this.draw(i, j, w, h)
  }

  resize() {
    super.resize()
    Y = Math.floor(X*this.Height/this.Width)
  }

  draw(x, y, dx, dy) {
    let Xp = (x-X/2)*S, Yp = (y-Y/2)*S, p
    if (p = this.getLerp(Xp, Yp)) {
      let [a, b] = p
      this.ctx.strokeStyle = this.getColor(a)
      this.ctx.beginPath()
      this.ctx.moveTo(...a)
      this.ctx.lineTo(...b)
      this.ctx.closePath()
      this.ctx.stroke()
    }
  }

  getLerpIndex(a, b, c, d) {
    let [A, B, C, D] = [a<1, b<1, c<1, d<1],
        s = A+B+C+D
    if (s == 0 || s == 4) return null
    return [A+B, A+C, C+D, B+D]
          .flatMap((val, idx) => val == 1 ? [idx] : [])
  }

  getLerpPosition(A, B, C, D, px, py, a) {
    let ratio = (x, y) => (1-2*(a%2))*S*(1-(a%2?y:x))/(y-x)
    switch (a) {
      case 0: px += ratio(A, B); py += S; break
      case 2: px += ratio(C, D); break
      case 1: py += ratio(A, C); break
      case 3: py += ratio(B, D); px += S;break
    }
    return [px, py]
  }

  getLerp(Xp, Yp) {
    let A = this.f(Xp, Yp+S), B = this.f(Xp+S, Yp+S),
        C = this.f(Xp, Yp), D = this.f(Xp+S, Yp)
    let p = this.getLerpIndex(A, B, C, D)
    if (!p) return null
    let q = p.map(this.getLerpPosition.bind(this, A, B, C, D, Xp, Yp))
            .map(val => [
              grid2realX(val[0], this.Width) + this.Width/2,
              grid2realY(val[1], this.Height) + this.Height/2
            ])
    return q
  }

  getColor(p) {
    let [x, y] = p, W = this.Width, H = this.Height
    let r = Math.min(2*((x-W/2)**2 + (y-H/2)**2)**.5/H, 1),
        angle = Math.acos((1-2*y/H)/r)*57.3
    return `hsl(${angle}, ${r*100}%, 50%)`
  }
}

window.onload = () => {
  let v = new App()
  print(v.Width, v.Height)
  print(v.getColor([0, 0]))
}