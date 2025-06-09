import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss', '../../app.component.scss'],
})
export class RegisterComponent {

    isSubmitted = false;

    signUpForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmpassword: ['', Validators.required],
    });

    constructor(protected fb: FormBuilder,
        protected authSrv: AuthService,
        protected router: Router
    ) { }

    private checkMatchPassword(password: string | null = null, confPassword: string | null = null) {
        if (password === confPassword) {
            return true
        }
        else {
            return false;
        }
    }

    registerSubmit() {
        this.isSubmitted = true;

        if (this.signUpForm.valid) {

            if (this.checkMatchPassword(this.signUpForm.get('password')?.value, this.signUpForm.get('confirmpassword')?.value)) {

                const { name, email, password, } = this.signUpForm.value;
                this.authSrv.register(email!, password!, name!)
                    .pipe(
                        catchError(err => {
                            return throwError(() => err);
                        })
                    )
                    .subscribe(user => {
                        if (user) {
                            // TODO OPT SERVICE
                        }
                    });

            }
        }
        else {
            console.log('Form is invalid');
            this.signUpForm.get('confirmpassword')?.touched;
        }
    }

}
