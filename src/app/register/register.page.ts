import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private navCtrl: NavController) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  register() {
    if (this.registerForm.valid) {
      console.log('Cadastro realizado com sucesso!', this.registerForm.value);
      this.navCtrl.navigateForward('/home'); // Redireciona para a página inicial
    } else {
      console.log('Por favor, preencha todos os campos corretamente.');
    }
  }
  
}
