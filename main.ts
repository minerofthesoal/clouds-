enum WeatherType {
    //% block="clear"
    Clear,
    //% block="cloudy"
    Cloudy,
    //% block="rain"
    Rain,
    //% block="storm"
    Storm
}

namespace weatherSystem {
    let clouds: Sprite[] = []
    let weather = WeatherType.Clear
    let lightningActive = false

    //% block="set weather to $type"
    //% weight=100
    export function setWeather(type: WeatherType) {
        clearAll()
        weather = type

        if (type == WeatherType.Clear) return

        createClouds()

        if (type == WeatherType.Rain || type == WeatherType.Storm) {
            createRain()
        }

        if (type == WeatherType.Storm) {
            startLightning()
        }
    }

    //% block="create clouds"
    //% weight=90
    export function createClouds() {
        clearClouds()
        for (let i = 0; i < 5; i++) {
            let cloud = sprites.create(randomCloudShape(), SpriteKind.create())
            cloud.setPosition(randint(0, 160), randint(10, 50))
            cloud.vx = -10 + randint(0, 5)
            cloud.z = i
            cloud.setFlag(SpriteFlag.AutoDestroy, true)
            clouds.push(cloud)
        }
    }

    function randomCloudShape(): Image {
        let width = randint(30, 50)
        let height = randint(15, 25)
        let imgCloud = image.create(width, height)

        for (let i = 0; i < 20; i++) {
            let cx = randint(0, width - 1)
            let cy = randint(0, height - 1)
            let radius = randint(2, 5)

            for (let x = -radius; x <= radius; x++) {
                for (let y = -radius; y <= radius; y++) {
                    if (cx + x >= 0 && cx + x < width && cy + y >= 0 && cy + y < height) {
                        if (x * x + y * y <= radius * radius) {
                            imgCloud.setPixel(cx + x, cy + y, 15)
                        }
                    }
                }
            }
        }

        return imgCloud
    }

    function clearClouds() {
        for (let cloud of clouds) {
            cloud.destroy()
        }
        clouds = []
    }

    function clearAll() {
        clearClouds()
        sprites.allOfKind(SpriteKind.create()).forEach(s => s.destroy())
        lightningActive = false
    }

    function createRain() {
        game.onUpdateInterval(100, function () {
            if (weather != WeatherType.Rain && weather != WeatherType.Storm) return

            let drop = sprites.create(img`
                . . 
                1 1 
                . . 
            `, SpriteKind.create())

            drop.setPosition(randint(0, 160), 0)
            drop.vy = 60
            drop.setFlag(SpriteFlag.AutoDestroy, true)
        })
    }

    function startLightning() {
        lightningActive = true
        game.onUpdateInterval(4000, function () {
            if (weather != WeatherType.Storm || !lightningActive) return
            scene.setBackgroundColor(1)
            pause(100)
            scene.setBackgroundColor(9)
        })
    }

    //% block="update clouds display"
    //% weight=80
    export function updateCloudDisplay() {
        for (let cloud of clouds) {
            if (cloud.x + cloud.width < 0) {
                cloud.setImage(randomCloudShape())
                cloud.x = 160 + randint(0, 20)
                cloud.y = randint(10, 50)
                cloud.vx = -10 + randint(0, 5)
            }
        }
    }
}