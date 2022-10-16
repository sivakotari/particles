window.addEventListener('load', function() {
    const canvas = document.querySelector('canvas')
    const context = canvas.getContext('2d')
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    const image = document.querySelector('img')

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.originX = x;
            this.originY = y;
            this.color = color;
            this.size = this.effect.gap - 1;
            this.vx = Math.random() * 0.0625 - 0.03125;
            this.vy = Math.random() * 0.0625 - 0.03125;
            // this.vx = 0;
            // this.vy = 0;
            this.ease = 0.2;
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.angle = 0;
            this.force = 0;
            this.friction = 0.98;
        }
        draw(context) {
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.size, this.size)
        }
        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = -this.effect.mouse.rad / this.distance;

            if(this.distance < this.effect.mouse.rad) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

           this.x += (this.vx * this.friction) + (this.originX - this.x) * this.ease;
           this.y += (this.vy * this.friction) + (this.originY - this.y) * this.ease;
        }
    }

    class Effect {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.particlesArr = [];
            this.image = document.querySelector('img');
            this.centerX = this.width * 0.5;
            this.centerY = this.height * 0.5;
            this.x = this.centerX - (this.image.width * 0.5);
            this.y = this.centerY - (this.image.height * 0.5);
            this.gap = 4;
            this.mouse = {
                x: undefined,
                y: undefined,
                rad: 3000
            }
            window.addEventListener('mousemove', e => {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            })
        }
        init(context) {
            context.drawImage(this.image, this.x, this.y)
            const pixels = context.getImageData(0, 0, this.width, this.height).data
            for (let y = 0; y < this.height; y+= this.gap) {
                for (let x = 0; x < this.width; x+= this.gap) {
                    const index = (y * this.width + x) * 4
                    const red = pixels[index]
                    const green = pixels[index + 1]
                    const blue = pixels[index + 2]
                    const alpha = pixels[index + 3]
                    const color = `rgba(${red}, ${green}, ${blue})`

                    if(alpha > 0) {
                        this.particlesArr.push(new Particle(this, x, y, color))
                    }
                }
            }
        }
        draw(context) {
            this.particlesArr.forEach(particle => {
                particle.draw(context)
            })
        }
        update() {
            this.particlesArr.forEach(particle => {
                particle.update()
            })
        }
    }

    const effect = new Effect(canvas.width, canvas.height, context);console.log(effect)
    effect.init(context)

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        effect.draw(context)
        effect.update()
        requestAnimationFrame(animate)
    }

    animate()

})