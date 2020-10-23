import Element from './element.js'
import {newElement} from './utilities.js'

class Dialog extends Element {
  constructor(dialog) {
    super()
    let found = newElement(
      'newFollowFound',
      'p'
    )
    let title = newElement(
      'dialogTitle',
      'h2',
      dialog.title
    );
    let notes = newElement(
      'dialogNotes',
      'p',
      dialog.notes
    )
    let input = newElement(
      'dialogInput',
      'input',
      undefined,
      {type: 'text', placeholder: dialog.singleInput.placeholder},
      element => element.addEventListener('keyup', dialog.singleInput.events.keyup)
    )
    let inputs;
    if(dialog.singleInput) inputs = [input]
    let inputsElement = newElement(
      'dialogInputs',
      'div',
      inputs
    )
    let buttons = newElement(
      'dialogButtons',
      'div',
      [
         newElement(
          'dialogDone',
          'button',
          dialog.doneText,
          undefined,
          (element) => element.addEventListener('click', () => {
            Store.files.follows.push({
              address: input.value
            })
            Store.saveFiles();
            document.body.removeChild(dialog);
          })
        ),
         newElement(
          'dialogCancel',
          'button',
          'Cancel',
          undefined,
          element => element.addEventListener('click', () => document.body.removeChild(this.element))
        )
      ]
    )
    
    this.element = newElement(
      'dialog',
      'div',
      [
        title,
        notes,
        inputsElement,
        dialog.extraInfo,
        buttons
      ]
    )
    document.body.appendChild(this.asHTML());
  }
}
export default Dialog