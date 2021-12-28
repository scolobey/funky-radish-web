
export default class SVGService {

  generate = (recipe) => {

    return new Promise((fulfill, reject) => {
      // Create title element.
      let titleSection = ''
      if (recipe.title.length > 55) {
        reject(new Error('Title is too long to fit this format.'))
      }
      else {
        titleSection = '<tspan x="100" y="150" >' + recipe.title + '</tspan>'
      }

      // Create ingredientSection
      let y = 300
      let ingredientSection = recipe.ingredients.create.map(function(ing, index) {
        // What if the ingredient list is too long?
        if (y > 950) {
          reject(new Error('Ingredients are too long to fit this format.'))
        }

        let ingMaxLength = 35
        let ingElement = ''

        if (ing.name.length > ingMaxLength) {
          // two line ingredient
          let ingSplit = splitMultipleLines(ing.name, ingMaxLength)
          ingElement = '<tspan x="100" y="' + y.toString() + '">□ ' + ingSplit.shift() + '</tspan>'
            + ingSplit.map(function(ingSplice, index) {
              y+=30
              return '<tspan x="115" y="' + (y).toString() + '">' + ingSplice + '</tspan>'
            }).join('')
          y+=60
        }
        else {
          ingElement = '<tspan x="100" y="' + y.toString() + '">□ ' + ing.name + '</tspan>'
          y+=60
        }
        return ingElement
      }).join('')

      // Create directionSection
      let dirCount = 1
      let z = 300

      let directionSection = recipe.directions.create.map(function(dir, index) {
        // What if the ingredient list is too long, or the ingredient name itself is too long?
        if (z > 950) {
          reject(new Error('Directions are too long to fit this format.'))
        }

        let dirMaxLength = 110
        let dirElement = ''

        if (dir.text.length > dirMaxLength) {
          let dirSplit = splitMultipleLines(dir.text, dirMaxLength)

          dirElement = '<tspan x="650" y="' + z.toString() + '">' + dirCount.toString() + '. ' + dirSplit.shift() + '</tspan>'
            + dirSplit.map(function(dirSplice, index) {
              z+=30
              return '<tspan x="676" y="' + z.toString() + '">' + dirSplice + '</tspan>'
            }).join('')
          z+=60
        }
        else {
          dirElement = '<tspan x="650" y="' + z.toString() + '">'  + dirCount.toString() + '. ' + dir.text + '</tspan>'
          z+=60
        }
        dirCount++
        return dirElement
      }).join('')

      let image = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="1920" height="1080" viewBox="0 0 1920 1080"> <rect x="0" y="0" width="100%" height="100%" fill="rgb(162,255,177)"/> <text font-family="Helvetica" font-size="60" font-style="normal">'
      + titleSection +
      '</text> <text font-family="Helvetica" font-size="24" font-style="normal">'
      + ingredientSection +
      '</text> <text font-family="Helvetica" font-size="24" font-style="normal">'
      + directionSection +
      '</text><path d="M575,950 v-700" stroke="black" stroke-width="6" /></svg>'

      localStorage.setItem('mint_image', image);
      localStorage.setItem('mint_recipe', recipe);

      fulfill(image)
    })
  }
}

function splitLines(text, maxLength) {
  let splitIndex = maxLength
  //What if it contains no whitepace?
  while (text[ splitIndex ] !== ' ') {
    splitIndex--
  }
  return splitAtIndex(text, splitIndex)
}

function splitMultipleLines(text, maxLength) {
  let splitText = []
  let remainingText = text

  while (remainingText.length > maxLength) {
    let splitSection = splitLines(remainingText, maxLength)
    splitText.push(splitSection[0])
    if (splitSection[1].length > maxLength) {
      remainingText = splitSection[1]
    } else {
      splitText.push(splitSection[1])
      remainingText = ''
      return splitText
    }
  }
}

function splitAtIndex(value, index) {
  return [value.substring(0, index).trim(), value.substring(index).trim()]
}
