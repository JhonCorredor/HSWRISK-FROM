import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService, Messages, MessageType } from '../../../../admin/helper.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

/**
 * Contact Component
 */
export class ContactComponent implements OnInit {
  statusForm: boolean = true;
  frmContact: FormGroup;
  sender_name: string = "HSW RISK";
  sender_email: string = "info@hswrisk.com";
  to_name: string = "Inscripciones";
  to_email: string = "inscripciones@hswrisk.com";
  api_key: string = "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";
  templateId: number = 1;

  constructor(
    private helperService: HelperService,
  ) {
    this.frmContact = new FormGroup({
      Name: new FormControl(null, Validators.required),
      Email: new FormControl(null, Validators.required),
      Subjet: new FormControl(null, Validators.required),
      Message: new FormControl(null, Validators.required),
      TratamientoDatos: new FormControl(false, Validators.required),
    });
  }

  ngOnInit(): void {
  }

  SendEmail() {
    if (this.frmContact.invalid || this.frmContact.controls["TratamientoDatos"].value != true) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.helperService.showLoading();

    var data = {
      ...this.frmContact.value
    }

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': this.api_key
      },
      body: JSON.stringify({
        sender: { name: this.sender_name, email: this.sender_email },
        headers: {
          'sender.ip': '1.2.3.4',
          'X-Mailin-custom': 'some_custom_header'
        },
        to: [{ email: this.to_email, name: this.to_name }],
        templateId: this.templateId,
        params: { NOMBREC: data.Name, CORREO: data.Email, ASUNTO: data.Subjet, MENSAJE: data.Message },
        subject: "CONTACTO",
      })
    };

    fetch('https://api.brevo.com/v3/smtp/email', options)
      .then(response => response.json())
      .then(response => this.helperService.showMessage(MessageType.SUCCESS, "Mensaje enviado correctamente!"))
      .catch(err => this.helperService.showMessage(MessageType.WARNING, err));

    setTimeout(() => {
      this.helperService.hideLoading();
      this.frmContact.reset();
    }, 500);
  }
}
