export class Ball {
  constructor(x, y, r, wx, wy, vx, vy) {
    Object.assign(this, {x, y, r, wx, wy, vx, vy})
  }

  dist(x0, y0) {
    return ((this.x-x0)**2 + (this.y-y0)**2)**.5
  }

  move() {
    this.checkCollide()
    this.x += this.vx*0.015
    this.y += this.vy*0.015
  }

  checkCollide() {
    let {x, y, r, wx, wy} = this
    let W = wx/2, H = wy/2
    let Xp = grid2realX(x, wx), Yp = grid2realY(y, wy),
        R = grid2realX(r, wx)
    if (Xp+R > W || Xp < R-W) this.vx *= -1
    if (Yp+R > H || Yp < R-H) this.vy *= -1
  }
}