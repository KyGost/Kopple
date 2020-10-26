import Element from './element.js'
import DialogTemplate from './dialogTemplate.js'
import {newElement, fromTemplate, getTemplate} from '../classes/utilities.js'

class Dialog extends Element {
  constructor(dialog) {
    super()
    let inputs = []
    dialog.inputs.forEach(input => {
      let isSelect = input.type === 'select';
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
           isSelect ? 'select' : 'input',
          (isSelect ? input.options.map(option => newElement(undefined, 'option', option)) : undefined),
          input
        )
      ]))
    })

    this.element = fromTemplate(
      DialogTemplate,
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
  }
  remove = () => document.body.removeChild(this.element)
}
export default Dialog