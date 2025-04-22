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

namespace SpriteKind {
    export const Cloud = SpriteKind.create()
}

namespace weatherSystem {
    let clouds: Sprite[] = []
    let weather = WeatherType.Clear
    let lightningActive = false

    // Optional: use your own cloud image asset
    export let cloudImage: Image = null

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

    function createClouds() {
        clearClouds()

        for (let i = 0; i < 5; i++) {
            const img = cloudImage ? cloudImage.clone() : randomCloudShape()
            const cloud = sprites.create(img, SpriteKind.Cloud)
            cloud.setPosition(randint(0, 160), randint(10, 50))
            cloud.vx = -10 + randint(2, 6)
            cloud.z = 1
            cloud.setFlag(SpriteFlag.AutoDestroy, false)
            clouds.push(cloud)
        }
    }

    function randomCloudShape(): Image {
        const width = randint(30, 50)
        const height = randint(15, 25)
        const imgCloud = image.create(width, height)

        for (let i = 0; i < 20; i++) {
            const cx = randint(0, width - 1)
            const cy = randint(0, height - 1)
            const radius = randint(2, 5)

            for (let x = -radius; x <= radius; x++) {
                for (let y = -radius; y <= radius; y++) {
                    const px = cx + x
                    const py = cy + y
                    if (px >= 0 && px < width && py >= 0 && py < height) {
                        if (x * x + y * y <= radius * radius) {
                            imgCloud.setPixel(px, py, 15)
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

            const drop = sprites.create(img`
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
            if (cloud.right < 0) {
                cloud.setImage(cloudImage ? cloudImage.clone() : randomCloudShape())
                cloud.left = 160 + randint(10, 30)
                cloud.y = randint(10, 50)
                cloud.vx = -10 + randint(2, 6)
            }
        }
    }
}