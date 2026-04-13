export class Circle {
    constructor(public x: number, public y: number, public radius: number, public radiusVelocity: number = 100.0) {
    }
}

export interface Collision {
    time: number

    resolve(): void

    clear(): void
}

export class CollisionPair implements Collision {
    time: number = 0
    circleA: Circle | null = null
    circleB: Circle | null = null
    type: number = 0

    detect(a: Circle, b: Circle, max: number): boolean {
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dd = Math.sqrt(dx * dx + dy * dy)
        const pr0 = a.radius
        const pr1 = b.radius
        const vr0 = a.radiusVelocity
        const vr1 = b.radiusVelocity
        const dt0 = (pr1 - pr0) / (vr0 - vr1)
        const dt1 = -(pr1 - pr0 + dd) / (vr1 - vr0)
        const dt2 = (-pr1 + pr0 + dd) / (vr1 - vr0)
        const dt3 = (-pr1 - pr0 + dd) / (vr1 + vr0)
        if (0.0 <= dt0 && dt0 < max && 0.0 === dd) {
            if (0.0 <= vr0 - vr1) {
                this.time = dt0
                this.type = 0
                this.circleA = a
                this.circleB = b
                return true
            }
        } else if (0.0 <= dt1 && dt1 < max) {
            if (0.0 <= vr1 - vr0) {
                this.time = dt1
                this.type = 0
                this.circleA = a
                this.circleB = b
                return true
            }
        } else if (0.0 <= dt2 && dt2 < max) {
            if (0.0 <= vr0 - vr1) {
                this.time = dt2
                this.type = 0
                this.circleA = a
                this.circleB = b
                return true
            }
        } else if (0.0 <= dt3 && dt3 < max) {
            if (0.0 <= vr1 + vr0) {
                this.time = dt3
                this.type = 1
                this.circleA = a
                this.circleB = b
                return true
            }
        }
        return false
    }

    resolve(): void {
        if (this.circleA === null || this.circleB === null) {
            throw new Error("cannot resolve. circle is null.")
        }
        const av = this.circleA.radiusVelocity
        const bv = this.circleB.radiusVelocity
        if (this.type === 0) {
            this.circleA.radiusVelocity = bv
            this.circleB.radiusVelocity = av
        } else if (this.type === 1) {
            this.circleA.radiusVelocity = -bv
            this.circleB.radiusVelocity = -av
        }
    }

    clear(): void {
        this.circleA = null
        this.circleB = null
    }
}

export class CollisionSelf implements Collision {
    time: number = 0
    circle: Circle | null = null

    detect(circle: Circle, max: number): boolean {
        if (0.5 > circle.radiusVelocity) {
            const delta = (0.5 - circle.radius) / circle.radiusVelocity
            if (0.0 <= delta && delta < max) {
                this.time = delta
                this.circle = circle
                return true
            }
        }
        return false
    }

    resolve(): void {
        if (this.circle === null) {
            throw new Error("cannot resolve. circle is null.")
        }
        this.circle.radiusVelocity = -this.circle.radiusVelocity
    }

    clear(): void {
        this.circle = null
    }
}

export class PulsateSolver {
    readonly circles: Circle[] = []
    readonly collisionSelf = new CollisionSelf()
    readonly collisionPair = new CollisionPair()

    clear(): void {
        this.circles.length = 0
    }

    run(time: number, observer: (collision: Collision) => void): void {
        let remaining = time
        while (remaining > 0.0) {
            const collision = this.detect(remaining)
            if (collision === null) {break}
            observer(collision)
            this.integrate(collision.time)
            remaining -= collision.time
            collision.resolve()
        }
        if (remaining > 0.0) {
            this.integrate(remaining)
        }
        this.collisionSelf.clear()
        this.collisionPair.clear()
    }

    private detect(dt: number): Collision | null {
        const maxRadius = 2048.0
        let collision: Collision | null = null
        let time = dt
        let i = this.circles.length
        while (--i > -1) {
            const a = this.circles[i]
            if (a.radius > maxRadius) {
                this.circles.splice(i, 1)
                continue
            }
            if (this.collisionSelf.detect(a, time)) {
                collision = this.collisionSelf
                time = collision.time
            }
            let j = i
            while (--j > -1) {
                const b = this.circles[j]
                if (this.collisionPair.detect(a, b, time)) {
                    collision = this.collisionPair
                    time = collision.time
                }
            }
        }
        return collision
    }

    private integrate(dt: number): void {
        for (const circle of this.circles) {
            circle.radius += circle.radiusVelocity * dt
        }
    }
}
