import Element from './element.js'
import {newElement, fromTemplate, getTemplate} from './utilities.js'

let template
getTemplate('dialog').then(templateResult => template = templateResult)

class Dialog extends Element {
  constructor(dialog) {
    super()
    let inputs = []
    dialog.inputs.forEach(input => {
      inputs.push(newElement(
        'dialogInputHolder',
        'div',
        [
        newElement(
          'dialogLabel',
          'span',
          input.label
        ),
        newElement(
          'dialogInput',
          'input',
          undefined,
          input
        )
      ]))
    });
    ((template) ? (async () => {})() : getTemplate('dialog').then(templateResult => template = templateResult)).then(() => { // Gross // TODO: Remove the grossness
      this.element = fromTemplate(
        template,
        {
          dialogTitle: {innerText: dialog.title},
          dialogNotes: {innerText: dialog.notes},
          dialogInputs: {
            appendChildren: inputs
          },
          dialogDone: {
            innerText: dialog.doneText || 'Done',
            interactions: {click: (element) => {(dialog.doneClick || (() => {}))(element), this.remove()}}
          },
          dialogExtraInfo: {appendChildren: [dialog.extraInfo || document.createElement('div')]},
          dialogCancel: {interactions: {click: this.remove}}
        }
      ).querySelector('.dialog')

      document.body.appendChild(this.element)
    })
  }
  remove = () => document.body.removeChild(this.element)
}
export default Dialog