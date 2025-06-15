import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

// Interfaccia unificata per Utente e Operatore
export interface Utente {
  id: number;
  nomeCompleto: string;
  email: string;
  ruolo: 'Operatore' | 'Utente'; // Ruolo può essere uno dei due valori
  dataCreazione: string;
  password?: string; // La password è opzionale e usata solo per la creazione
}

@Component({
  selector: 'app-gestione-operatori',
  templateUrl: './gestione-operatori.component.html',
  styleUrls: ['./gestione-operatori.component.scss']
})
export class GestioneOperatoriComponent implements OnInit {
  utenti: User[] = [];
  utentiFiltrati: User[] = [];
  searchTerm: string = '';
  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  utenteDaModificare: User | null = null;
  errorMessage: string = '';

  userForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      isOperator: [true],
      isVerified: [true]
    }, { validators: this.matchPasswordValidator() });
  }

  ngOnInit() {
    this.caricaUtenti();
  }

  matchPasswordValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      
      // Se entrambi i campi sono vuoti, non c'è errore
      if (!password && !confirmPassword) {
        return null;
      }
      
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }

  caricaUtenti() {
    this.authService.fetchUsers().subscribe({
      next: (utenti) => {
        this.utenti = utenti;
        this.filtraUtenti();
      },
      error: (error) => {
        this.errorMessage = 'Errore nel caricamento degli utenti';
        console.error('Errore nel caricamento degli utenti:', error);
      }
    });
  }

  filtraUtenti() {
    if (!this.searchTerm) {
      this.utentiFiltrati = this.utenti;
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.utentiFiltrati = this.utenti.filter(utente =>
        utente.name.toLowerCase().includes(searchLower) ||
        utente.email.toLowerCase().includes(searchLower)
      );
    }
  }

  trackById(index: number, item: User): string {
    return item.id;
  }

  apriModaleAggiungi() {
    this.isAddModalOpen = true;
    this.isEditModalOpen = false;
    this.userForm.reset({
      isOperator: true,
      isVerified: true
    });
    // Imposta i validatori per la password quando si aggiunge un nuovo operatore
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
  }

  apriModaleModifica(utente: User) {
    this.isEditModalOpen = true;
    this.isAddModalOpen = false;
    this.utenteDaModificare = utente;
    // Rimuovi i validatori per la password quando si modifica un utente
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('confirmPassword')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('confirmPassword')?.updateValueAndValidity();
    this.userForm.patchValue({
      name: utente.name,
      email: utente.email,
      isOperator: utente.isOperator,
      password: '',
      confirmPassword: ''
    });
  }

  chiudiModali() {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.utenteDaModificare = null;
    this.errorMessage = '';
    this.userForm.reset();
  }

  aggiungiOperatore() {
    if (this.userForm.valid) {
      const { name, email, password, isOperator, isVerified } = this.userForm.value;
      this.authService.register(name, email, password, isOperator, isVerified).subscribe({
        next: (user) => {
          this.caricaUtenti();
          this.chiudiModali();
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Errore durante la creazione dell\'operatore';
        }
      });
    }
  }

  salvaModificheUtente() {
    if (this.userForm.valid && this.utenteDaModificare) {
      const { name, email, isOperator } = this.userForm.value;
      const utenteModificato: User = {
        ...this.utenteDaModificare,
        name,
        email,
        isOperator
      };

      this.authService.editUser(utenteModificato).subscribe({
        next: (user) => {
          this.caricaUtenti();
          this.chiudiModali();
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Errore durante la modifica dell\'utente';
        }
      });
    }
  }
}
