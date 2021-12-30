import React, { useRef, useEffect } from 'react'

// 256^3 = 16,777,216 colours in 24-bit color
const colourMagnitude = 32, // number of colours is colourMagnitude^3
  colSteps = 256 / colourMagnitude, // break 256 into x steps
  width = colourMagnitude * 8,
  height = Math.pow(colourMagnitude, 3) / width,
  similarityTolerance = 500

let allColours: Array<Colour> = []
let allPixels: boolean[][] = []
const beginTime = new Date().getMilliseconds()

const Canvas = () => {
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>

  useEffect(() => {
    initialise()
    // once the component has mounted
    const context = canvasRef.current.getContext(
      '2d',
    ) as CanvasRenderingContext2D

    // select a pixel as the starting location and colour it
    let currPixel: Pixel = {
      x: randInt(0, width - 1),
      y: randInt(0, height - 1),
    }
    allPixels[currPixel.x][currPixel.y] = false
    let currColour = allColours.splice(randInt(0, allColours.length - 1), 1)[0]

    draw(context, currPixel, currColour)

    while (allColours.length > 0) {
      currPixel = getNeighbourOrRandomPixel(currPixel)
      currColour = getSimilarColour(currColour)
      draw(context, currPixel, currColour)
    }
    console.log(new Date().getMilliseconds() - beginTime)
  })

  return <canvas ref={canvasRef} width={width} height={height} />
}

export default Canvas

function initialise() {
  // add all the colours to an array
  for (let red = colSteps - 1; red < 256; red += colSteps)
    for (let blue = colSteps - 1; blue < 256; blue += colSteps)
      for (let green = colSteps - 1; green < 256; green += colSteps)
        allColours.push({
          red: Math.round(red),
          blue: Math.round(blue),
          green: Math.round(green),
        })

  for (let x = 0; x < width; x++) {
    allPixels[x] = []
    for (let y = 0; y < height; y++) allPixels[x][y] = true
  }
}

function getNeighbourOrRandomPixel(pixel: Pixel): Pixel {
  let neighbourPixel: Array<Pixel> = []

  for (let y = pixel.y - 1; y <= pixel.y + 1; y++) {
    for (let x = pixel.x - 1; x <= pixel.x + 1; x++) {
      if (
        x < 0 ||
        y < 0 ||
        x > width - 1 ||
        y > height - 1 ||
        (pixel.x === x && pixel.y === y) ||
        !allPixels[x][y]
      )
        continue

      neighbourPixel.push({ x, y })
    }
  }

  if (neighbourPixel.length > 0) {
    const toReturn = neighbourPixel.splice(
      randInt(0, neighbourPixel.length - 1),
      1,
    )[0]

    allPixels[toReturn.x][toReturn.y] = false
    return toReturn
  }

  // if no neighbour is available find one any pixel that is
  for (let x = 0; x < width; x++) {
    const posY = allPixels[x].findIndex((p) => p)
    if (posY >= 0) {
      allPixels[x][posY] = false
      return { x, y: posY }
    }
  }

  throw new Error(
    `No pixel available but colour length is: ${allColours.length}`,
  )
}

function getSimilarColour(colour: Colour): Colour {
  let similarColours: Array<ColourCompare> = []

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

  const closetColour = similarColours.reduce(
    (acc: ColourCompare, curr: ColourCompare) =>
      acc.diff <= curr.diff ? acc : curr,
  )

  return allColours.splice(closetColour.index, 1)[0]
}

function draw(ctx: CanvasRenderingContext2D, pixel: Pixel, colour: Colour) {
  ctx.fillStyle =
    'rgb(' + colour.red + ',' + colour.blue + ',' + colour.green + ')'
  ctx.fillRect(pixel.x, pixel.y, 1, 1)
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

interface ColourCompare {
  index: number
  diff: number
  colour: Colour
}

interface Pixel {
  x: number
  y: number
}

interface Colour {
  red: number
  blue: number
  green: number
}
