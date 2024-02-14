import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { PersonasFormComponent } from '../../../security/personas/personas-form/personas-form.component';
import { DataSelectDto } from 'src/app/generic/dataSelectDto';
import { GeneralParameterFormComponent } from '../../../general-parameter/general-parameter-form/general-parameter-form.component';
import { EmpresaFormComponent } from '../../empresa/empresa-form/empresa-form.component';

@Component({
  selector: 'app-clientes-form',
  standalone: false,
  templateUrl: './clientes-form.component.html',
  styleUrl: './clientes-form.component.css',
})
export class ClientesFormComponent implements OnInit {
  frmClientes: FormGroup;
  statusForm: boolean = true;
  id!: number;
  botones = ['btn-guardar', 'btn-cancelar'];
  title = 'Crear Cliente';
  breadcrumb = [
    { name: `Inicio`, icon: `fa-duotone fa-house` },
    { name: 'Parametros', icon: 'fa-duotone fa-gears' },
    { name: 'Clientes', icon: 'fa-duotone fa-user' },
    { name: 'Crear', icon: 'fa-duotone fa-octagon-plus' },
  ];
  listPersonas = signal<DataSelectDto[]>([]);
  listArl = signal<DataSelectDto[]>([]);
  listEmpresas = signal<DataSelectDto[]>([]);
  public listaRh: any[] = [{ nombre: 'A+' }, { nombre: 'A-' }, { nombre: 'B+' }, { nombre: 'B-' }, { nombre: 'AB+' }, { nombre: 'AB-' }, { nombre: 'O+' }, { nombre: 'O-' }];
  public listaLectoEscritura: any[] = [{ nombre: 'ALFABETA' }, { nombre: 'ANALFABETA' }];
  public listaTipoCliente: any[] = [{ nombre: 'INDEPENDIENTE' }, { nombre: 'EMPRESA' }];
  public listaNivelEducativo: any[] = [
    { nombre: 'PRIMARIA' },
    { nombre: 'SECUNDARIA' },
    { nombre: 'TECNICO' },
    { nombre: 'TECNOLOGO' },
    { nombre: 'UNIVERSITARIO' },
    { nombre: 'OTRO' },
  
  ];

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.frmClientes = new FormGroup({
      Codigo: new FormControl(null, [Validators.required]),
      TipoCliente: new FormControl(null, [Validators.required]),
      NivelEducativo: new FormControl(null, [Validators.required]),
      CargoActual: new FormControl(null, [Validators.required]),
      AreaTrabajo: new FormControl(null, [Validators.required]),
      LectoEscritura: new FormControl(null, [Validators.required]),
      Rh: new FormControl(null, [Validators.required]),
      Enfermedades: new FormControl("N/A", [Validators.required]),
      Alergias: new FormControl("N/A", [Validators.required]),
      Medicamentos: new FormControl("N/A", [Validators.required]),
      Lesiones: new FormControl("N/A", [Validators.required]),
      Acudiente: new FormControl(null, [Validators.required]),
      TelefonoAcudiente: new FormControl(null, [Validators.required]),
      PersonaId: new FormControl(null, [Validators.required]),
      ArlId: new FormControl(null, [Validators.required]),
      EmpresaId: new FormControl(null, [Validators.required]),
      Activo: new FormControl(true, Validators.required),
    });
    this.routerActive.params.subscribe((l) => (this.id = l['id']));
  }

  ngOnInit(): void {
    this.cargarPersonas(false);
    this.cargarArl(false);
    this.cargarEmpresas(false);
    if (this.id != undefined && this.id != null) {
      this.title = 'Editar Cliente';
      this.breadcrumb = [
        { name: `Inicio`, icon: `fa-duotone fa-house` },
        { name: 'Parametros', icon: 'fa-duotone fa-gears' },
        { name: 'Clientes', icon: 'fa-duotone fa-user' },
        { name: 'Editar', icon: 'fa-duotone fa-pen-to-square' },
      ];
      this.service.getById('Cliente', this.id).subscribe((l) => {
        this.frmClientes.controls['Codigo'].setValue(l.data.codigo);
        this.frmClientes.controls['TipoCliente'].setValue(l.data.tipoCliente);
        this.frmClientes.controls['NivelEducativo'].setValue(l.data.nivelEducativo);
        this.frmClientes.controls['CargoActual'].setValue(l.data.cargoActual);
        this.frmClientes.controls['AreaTrabajo'].setValue(l.data.areaTrabajo);
        this.frmClientes.controls['LectoEscritura'].setValue(l.data.lectoEscritura);
        this.frmClientes.controls['Rh'].setValue(l.data.rh);
        this.frmClientes.controls['Enfermedades'].setValue(l.data.enfermedades);
        this.frmClientes.controls['Alergias'].setValue(l.data.alergias);
        this.frmClientes.controls['Medicamentos'].setValue(l.data.medicamentos);
        this.frmClientes.controls['Lesiones'].setValue(l.data.lesiones);
        this.frmClientes.controls['Acudiente'].setValue(l.data.acudiente);
        this.frmClientes.controls['TelefonoAcudiente'].setValue(l.data.telefonoAcudiente);
        this.frmClientes.controls['PersonaId'].setValue(l.data.personaId);
        this.frmClientes.controls['ArlId'].setValue(l.data.arlId);
        this.frmClientes.controls['EmpresaId'].setValue(l.data.empresaId);
        this.frmClientes.controls['Activo'].setValue(l.data.activo);
      });
    }
  }

  save() {
    if (this.frmClientes.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }

    this.frmClientes.controls['TelefonoAcudiente'].setValue(this.frmClientes.controls['TelefonoAcudiente'].value.toString());
    let data = {
      id: this.id ?? 0,
      ...this.frmClientes.value,
    };
    this.service.save('Cliente', this.id, data).subscribe(
      (response) => {
        if (response.status) {
          this.helperService.showMessage(
            MessageType.SUCCESS,
            Messages.SAVESUCCESS
          );

          var ruta: string[] = this.router.url.toString().split('/');

          console.log(ruta);
          if (ruta[2] != 'parametros') {
            this.modalService.dismissAll();
          } else {
            this.helperService.redirectApp('dashboard/parametros/clientes');
          }
        }
      },
      (error) => {
        this.helperService.showMessage(MessageType.WARNING, error);
      }
    );
  }

  cancel() {
    var ruta: string[] = this.router.url.toString().split('/');
    if (ruta[2] != 'parametros') {
      this.modalService.dismissAll();
    } else {
      this.helperService.redirectApp('dashboard/parametros/clientes');
    }
  }

  nuevaPersona() {
    let modal = this.modalService.open(PersonasFormComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: false,
      centered: true,
    });

    modal.componentInstance.titleData = 'Persona';
    modal.componentInstance.serviceName = 'Persona';
    modal.componentInstance.key = 'Ciudad';

    modal.result.finally(() => {
      this.listPersonas = signal<DataSelectDto[]>([]);

      setTimeout(() => {
        this.cargarPersonas(true);
      }, 200);
    });
  }

  nuevaArl() {
    let modal = this.modalService.open(GeneralParameterFormComponent, { size: 'md', keyboard: false, backdrop: false, centered: true });

    modal.componentInstance.titleData = "Arl";
    modal.componentInstance.serviceName = "Arl";

    modal.result.finally(() => {
      this.listArl = signal<DataSelectDto[]>([]);

      setTimeout(() => {
        this.cargarArl(true);
      }, 200);
    });
  }

  cargarPersonas(nuevo: boolean) {
    this.service.getAll('Persona').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.listPersonas.update((listPersonas) => {
          const DataSelectDto: DataSelectDto = {
            id: item.id,
            textoMostrar: `${item.documento} - ${item.primerNombre} ${item.primerApellido}`,
            activo: item.activo,
          };

          return [...listPersonas, DataSelectDto];
        });
        if (nuevo) {
          this.frmClientes.controls['PersonaId'].setValue(item.id);
        }
      });
    });
  }

  cargarArl(nuevo: boolean) {
    this.service.getAll('Arl').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.listArl.update((listArl) => {
          const DataSelectDto: DataSelectDto = {
            id: item.id,
            textoMostrar: `${item.codigo} - ${item.nombre}`,
            activo: item.activo,
          };

          return [...listArl, DataSelectDto];
        });
        if (nuevo) {
          this.frmClientes.controls['ArlId'].setValue(item.id);
        }
      });
    });
  }

  cargarEmpresas(nuevo: boolean) {
    this.service.getAll('Empresa').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.listEmpresas.update(listEmpresas => {
          const DataSelectDto: DataSelectDto = {
            id: item.id,
            textoMostrar: `${item.nit} - ${item.razonSocial}`,
            activo: item.activo
          };

          return [...listEmpresas, DataSelectDto];
        });

        if (nuevo) {
          this.frmClientes.controls['EmpresaId'].setValue(item.id);
        }
      });
    });
  }

  nuevaEmpresa() {
    let modal = this.modalService.open(EmpresaFormComponent, { size: 'xl', keyboard: false, backdrop: false, centered: true });
    modal.result.finally(() => {
      this.listEmpresas = signal<DataSelectDto[]>([]);

      setTimeout(() => {
        this.cargarEmpresas(true);
      }, 200);
    });
  }
}
@NgModule({
  declarations: [ClientesFormComponent],
  imports: [CommonModule, GeneralModule],
})
export class ClientesFormModule { }