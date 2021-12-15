import React, { useRef, useEffect } from 'react'

const width = 256,
  height = 128,
  similarityTolerance = 500,
  colSteps = 256 / 32

let allColours: Array<Colour> = []
let allPixels: number[][] = []

const Canvas = () => {
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>

  useEffect(() => {
    initialise()

    // once the component has mounted
    const canvas = canvasRef.current
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    // select a pixel as the starting location and colour it
    let currPixel = new Pixel(randInt(0, width - 1), randInt(0, height - 1))
    allPixels[currPixel.x][currPixel.y] = 0
    let currColour = allColours.splice(randInt(0, allColours.length - 1), 1)[0]

    draw(context, currPixel, currColour)

    while (allColours.length > 0) {
      currPixel = getNeighbourOrRandomPixel(currPixel)
      currColour = getSimilarColour(currColour)
      draw(context, currPixel, currColour)
    }
    console.log('Rendered Successfully', allColours.length)
  })

  return <canvas ref={canvasRef} width={width} height={height} />
}

export default Canvas

const initialise = () => {
  // add all the colours to an array
  for (let red = 7; red < 256; red += colSteps) {
    for (let blue = 7; blue < 256; blue += colSteps) {
      for (let green = 7; green < 256; green += colSteps) {
        allColours.push(
          new Colour(Math.round(red), Math.round(blue), Math.round(green)),
        )
      }
    }
  }

  for (let x = 0; x < width; x++) {
    allPixels[x] = []
    for (let y = 0; y < height; y++) allPixels[x][y] = 1
  }
}

class Colour {
  red: number
  blue: number
  green: number
  constructor(red: number, blue: number, green: number) {
    this.red = red
    this.blue = blue
    this.green = green
  }

  asString(): string {
    return 'rgb(' + this.red + ',' + this.blue + ',' + this.green + ')'
  }
}

class Pixel {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  equals(_pixel: Pixel): boolean {
    return _pixel.x === this.x && _pixel.y === this.y
  }
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function draw(ctx: CanvasRenderingContext2D, pixel: Pixel, colour: Colour) {
  ctx.fillStyle = colour.asString()
  ctx.fillRect(pixel.x, pixel.y, 1, 1)
}

function getNeighbourOrRandomPixel(pixel: Pixel): Pixel {
  for (let x = pixel.x - 1; x <= pixel.x + 1; x++) {
    for (let y = pixel.y - 1; y <= pixel.y + 1; y++) {
      if (
        !(
          x < 0 ||
          y < 0 ||
          x > width - 1 ||
          y > height - 1 ||
          (pixel.x === x && pixel.y === y)
        )
      ) {
        if (allPixels[x][y] === 1) {
          allPixels[x][y] = 0
          return new Pixel(x, y)
        }
      }
    }
  }

  // if no neighbour is available find one any pixel that is
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (allPixels[x][y] === 1) return new Pixel(x, y)
    }
  }

  throw new Error(
    `No pixel available but colour length is: ${allColours.length}`,
  )
}

function getSimilarColour(colour: Colour): Colour {
  let similarColours: Array<{
    index: number
    diff: number
    colour: Colour
  }> = []

  for (let i = 0; i < similarityTolerance && i < allColours.length; i++) {
    const index = randInt(0, allColours.length - 1)
    const testColour = allColours[index]

    // Algorithm to calculate the distance between two points in a three dimensional space EXCLUDING the power of 1/2 due to it impacting all values equally and taking up computing power
    similarColours.push({
      index,
      diff:
        Math.pow(testColour.red - colour.red, 2) +
        Math.pow(testColour.blue - colour.blue, 2) +
        Math.pow(testColour.green - colour.green, 2),
      colour: testColour,
    })
  }

  const toReturn = similarColours.reduce(
    (
      prev: { index: number; diff: number; colour: Colour },
      curr: { index: number; diff: number; colour: Colour },
    ) => (prev.diff < curr.diff ? prev : curr),
  )
  allColours.splice(toReturn.index, 1)

  return toReturn.colour
}
