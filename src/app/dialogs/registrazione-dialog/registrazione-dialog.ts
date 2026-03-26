import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtenteService } from '../../services/utente-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registrazione-dialog',
  standalone: false,
  templateUrl: './registrazione-dialog.html',
  styleUrl: './registrazione-dialog.css',
})
export class RegistrazioneDialog implements OnInit {
  account = signal<any>(null);
  mod: any;
  loadedTipoIndirizzo : any;
  selectedTipoIndirizzo: String ;

  updateForm: FormGroup = new FormGroup({
    nome: new FormControl(null, Validators.required),
    cognome: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    telefono: new FormControl(null, Validators.required),
    via: new FormControl(null, Validators.required),
    citta: new FormControl(null, Validators.required),
    cap: new FormControl(null, Validators.required),
    codiceFiscale : new FormControl(null, Validators.required),
    partitaIva : new FormControl(null),
    userName: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
    passwordControl: new FormControl(null, Validators.required),
    nazione: new FormControl(null, Validators.required),
    tipoIndirizzo: new FormControl(null)
  })





  msg = signal('');
  constructor(
    private accoutServices: UtenteService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RegistrazioneDialog>
  ) {
    if (data) {
      this.account.set(data.account);
      this.mod = data.mode;
      this.loadedTipoIndirizzo = data.tipiIndirizzo;
    }


  }



  ngOnInit(): void {



    if (this.mod == "U") {
      this.updateForm.patchValue({
        nome: this.account().nome,
        cognome: this.account().cognome,
        email: this.account().email,
        telefono: this.account().telefono,
        via: this.account().via,
        citta: this.account().citta,
        cap: this.account().cap,
        userName: this.account().userName,
        codiceFiscale : this.account().codiceFiscale,
        partitaIva: this.account().partitaIva,
        nazione : this.account().nazione,
        tipoIndirizzo : this.account().tipoIndirizzo
      })
      this.updateForm.controls['userName'].disable();

    }
  }

  changeTipoIndirizzo(tipo : any){
     console.log(tipo);
    this.accoutServices.getUserAnags()
        .subscribe({
            next: ((r:any) => {
              let indicetipo = 0;
              let trovato = false;
                for (let i = 0; i < r.anagrafiche.length; i++) {
                    if (r.anagrafiche[i].tipoIndirizzo == tipo){
                      indicetipo=i;
                      trovato = true;
                    }

                }

                let anagrafica = {
                  email: r.email,
                  userName: r.userName,
                  password : r.password,
                  role: r.role,
                  nome: r.anagrafiche[indicetipo].nome,
                  cognome: r.anagrafiche[indicetipo].cognome,
                  telefono: r.anagrafiche[indicetipo].telefono,
                  via: r.anagrafiche[indicetipo].via,
                  citta: r.anagrafiche[indicetipo].citta,
                  cap: r.anagrafiche[indicetipo].cap,
                  codiceFiscale : r.anagrafiche[indicetipo].codiceFiscale,
                  partitaIva: r.anagrafiche[indicetipo].partitaIva,
                  nazione : r.anagrafiche[indicetipo].nazione,
                  tipoIndirizzo : r.anagrafiche[indicetipo].tipoIndirizzo,
                  id : r.anagrafiche[indicetipo].id

                }
                this.account.set(anagrafica);
                this.updateForm.patchValue({
                  nome: !trovato ? null : this.account().nome,
                  cognome: !trovato ? null :this.account().cognome,
                  email: !trovato ? null :this.account().email,
                  telefono: !trovato ? null :this.account().telefono,
                  via: !trovato ? null :this.account().via,
                  citta: !trovato ? null :this.account().citta,
                  cap: !trovato ? null :this.account().cap,
                  userName: this.account().userName,
                  codiceFiscale : !trovato ? null :this.account().codiceFiscale,
                  partitaIva: !trovato ? null :this.account().partitaIva,
                  nazione : !trovato ? null :this.account().nazione,
                  tipoIndirizzo : tipo
                })
                if (trovato){
                  this.mod = 'U';
                } else {
                  this.mod = 'C';
                }
              }),
            error: ((r:any) => {
              console.log(r);
              this.mod = 'C';
            })

        })


  }


 onSubmit() {
    if (this.mod == 'C') this.onSubmitCreate();
    if (this.mod == 'U') this.onSubmitUpdate();
  }

  onSubmitUpdate() {
    this.msg.set('');
    const updateBody: any = { id: this.account().id };

    if (this.updateForm.controls['nome'].dirty)
      updateBody.nome = this.updateForm.value.nome;

    if (this.updateForm.controls['cognome'].dirty)
      updateBody.cognome = this.updateForm.value.cognome;

    if (this.updateForm.controls['email'].dirty)
      updateBody.email = this.updateForm.value.email;

    if (this.updateForm.controls['telefono'].dirty)
      updateBody.telefono = this.updateForm.value.telefono;

    if (this.updateForm.controls['via'].dirty)
      updateBody.via = this.updateForm.value.via;

    if (this.updateForm.controls['citta'].dirty)
      updateBody.citta = this.updateForm.value.citta;

    if (this.updateForm.controls['cap'].dirty)
      updateBody.cap = this.updateForm.value.cap;

    if (this.updateForm.controls['userName'].dirty)
      updateBody.userName = this.updateForm.value.userName;

    if (this.updateForm.controls['codiceFiscale'].dirty)
      updateBody.codiceFiscale = this.updateForm.value.codiceFiscale;

    if (this.updateForm.controls['partitaIva'].dirty)
      updateBody.partitaIva = this.updateForm.value.partitaIva;

    if (this.updateForm.controls['nazione'].dirty)
      updateBody.nazione = this.updateForm.value.nazione;

    if (this.updateForm.controls['tipoIndirizzo'].dirty)
      updateBody.tipoIndirizzo = this.updateForm.value.tipoIndirizzo;

    console.log(updateBody);

    this.accoutServices.update(updateBody)
      .subscribe({
        next: ((resp: any) => {
          console.log(resp);
          this.dialogRef.close();
        }),
        error: ((resp: any) => {
          this.msg.set(resp.error.msg);
        })
      })
  }


  onSubmitCreate() {
    this.msg.set("");

    if (this.updateForm.value.password != this.updateForm.value.passwordControl) {
      this.msg.set("password non coincidenti");
      return;
    }
    console.log("nome" + this.updateForm.value.nome);
    console.log("cognome" + this.updateForm.value.cognome);

    this.accoutServices.create({
      nome: this.updateForm.value.nome,
      cognome: this.updateForm.value.cognome,
      email: this.updateForm.value.email,
      telefono: this.updateForm.value.telefono,
      via: this.updateForm.value.via,
      citta: this.updateForm.value.citta,
      cap: this.updateForm.value.cap,
      userName: this.updateForm.value.userName,
      password: this.updateForm.value.password,
      nazione: this.updateForm.value.nazione,
      partitaIva : this.updateForm.value.partitaIva,
      codiceFiscale : this.updateForm.value.codiceFiscale,
      role: (this.account()!=null && this.account().role !=null) ? this.account().role : 'USER',
      tipoIndirizzo : this.updateForm.value.tipoIndirizzo !=null ? this.updateForm.value.tipoIndirizzo : 'PRINCIPALE'
    }).subscribe({
      next: ((resp: any) => {
        console.log(resp);
        this.dialogRef.close();
      }),
      error: ((resp: any) => {
        console.log(resp.error.msg)
        this.msg.set(resp.error.msg);
      })
    })
  }


}
