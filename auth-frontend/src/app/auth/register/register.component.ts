import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          this.toastr.success(
            'Kayıt işlemi başarılı! Lütfen e-posta adresinizi doğrulayın.',
            'Başarılı'
          );
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.error = 'Bu e-posta adresi zaten kullanımda';
          } else {
            this.error = err.error?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
          }
          this.toastr.error(this.error, 'Hata');
        }
      });
    } else {
      this.toastr.warning('Lütfen tüm alanları doğru şekilde doldurun.', 'Uyarı');
    }
  }
}
