import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

/**
 * Contact Component
 */
export class ContactComponent implements OnInit {
  frmContact: FormGroup;
  sender_name: string = "HSW RISK";
  sender_email: string = "josepoza125@gmail.com";
  to_name: string = "HSW RISK";
  to_email: string = "josepoza126@gmail.com";
  api_key: string = "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";
  templateId: number = 1;

  constructor() {
    this.frmContact = new FormGroup({
      Name: new FormControl(null, Validators.required),
      Email: new FormControl(null, Validators.required),
      Subjet: new FormControl(null, Validators.required),
      Message: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
  }

  SendEmail() {
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
        sender: {name: this.sender_name, email: this.sender_email},
        headers: {
          'sender.ip': '1.2.3.4',
          'X-Mailin-custom': 'some_custom_header',
          idempotencyKey: 'abc-123'
        },
        to: [{email: this.to_email, name: this.to_name}],
        templateId: this.templateId,
        params: {name: data.Name, correo: data.Email, asunto: data.Subjet, mensaje: data.Message},
        subject: "CONTACTO",
        batchId: '5c6cfa04-eed9-42c2-8b5c-6d470d978e9d'
      })
    };
    
    fetch('https://api.brevo.com/v3/smtp/email', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }
}
