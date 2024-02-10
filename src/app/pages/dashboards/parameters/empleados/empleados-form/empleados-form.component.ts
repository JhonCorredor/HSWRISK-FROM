import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralModule } from 'src/app/general/general.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralParameterService } from '../../../../../generic/general.service';
import { DataSelectDto } from '../../../../../generic/dataSelectDto';
import { PersonasFormComponent } from '../../../security/personas/personas-form/personas-form.component';
import { EmpresaFormComponent } from '../../empresa/empresa-form/empresa-form.component';

@Component({
  selector: 'app-empleados-form',
  standalone: false,
  templateUrl: './empleados-form.component.html',
  styleUrl: './empleados-form.component.css'
})
export class EmpleadosFormComponent implements OnInit {
  frmEmpleados: FormGroup;
  statusForm: boolean = true;
  id!: number;
  botones = ['btn-guardar', 'btn-cancelar'];
  title = 'Crear Empleados';
  breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Parametros ", icon: "fa-duotone fa-gears" }, { name: "Empleados", icon: "fa-duotone fa-user-tie" }, { name: 'Crear', icon: "fa-duotone fa-octagon-plus" }];
  listPersonas = signal<DataSelectDto[]>([]);
  listCargos = signal<DataSelectDto[]>([]);
  listEmpresas = signal<DataSelectDto[]>([]);
  listCajas = signal<DataSelectDto[]>([]);

  constructor(
    public routerActive: ActivatedRoute,
    private service: GeneralParameterService,
    private helperService: HelperService,
    private modalService: NgbModal
  ) {
    this.frmEmpleados = new FormGroup({
      Codigo: new FormControl("", [Validators.required]),
      PersonaId: new FormControl(null, [Validators.required]),
      EmpresaId: new FormControl(null, [Validators.required]),
      CargoId: new FormControl(null, [Validators.required]),
      Activo: new FormControl(true, Validators.required)
    });
    this.routerActive.params.subscribe((l) => (this.id = l['id']));
  }

  ngOnInit(): void {
    this.cargarListas();

    if (this.id != undefined && this.id != null) {
      this.title = 'Editar Empleado';
      this.breadcrumb = [{ name: `Inicio`, icon: `fa-duotone fa-house` }, { name: "Parametros ", icon: "fa-duotone fa-gears" }, { name: "Empleados", icon: "fa-duotone fa-user-tie" }, { name: 'Editar', icon: "fa-duotone fa-pen-to-square" }];
      this.service.getById("Empleado", this.id).subscribe((l) => {

        this.frmEmpleados.controls['Codigo'].setValue(l.data.codigo);
        this.frmEmpleados.controls['PersonaId'].setValue(l.data.personaId);
        this.frmEmpleados.controls['EmpresaId'].setValue(l.data.empresaId);
        this.frmEmpleados.controls['CargoId'].setValue(l.data.cargoId);
        this.frmEmpleados.controls['Activo'].setValue(l.data.activo);
      });
    }

  }

  cargarListas() {
    this.cargarPersonas(false);
    this.cargarEmpresas(false);
    this.cargarCargos();
  }

  cargarPersonas(nuevo: boolean) {
    this.service.getAll('Persona').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.listPersonas.update(listPersonas => {
          const DataSelectDto: DataSelectDto = {
            id: item.id,
            textoMostrar: `${item.documento} - ${item.primerNombre} ${item.primerApellido}`,
            activo: item.activo
          };

          return [...listPersonas, DataSelectDto];
        });

        if (nuevo) {
          this.frmEmpleados.controls['PersonaId'].setValue(item.id);
        }
      });
    });
  }

  cargarCargos() {
    this.service.getAll('Cargo').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.listCargos.update(listCargos => {
          const DataSelectDto: DataSelectDto = {
            id: item.id,
            textoMostrar: `${item.codigo} - ${item.nombre}`,
            activo: item.activo
          };

          return [...listCargos, DataSelectDto];
        });
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
          this.frmEmpleados.controls['EmpresaId'].setValue(item.id);
        }
      });
    });
  }

  save() {
    if (this.frmEmpleados.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = {
      id: this.id ?? 0,
      ...this.frmEmpleados.value,
    };
    this.service.save("Empleado", this.id, data).subscribe(
      (response) => {
        if (response.status) {
          this.helperService.showMessage(MessageType.SUCCESS, Messages.SAVESUCCESS);
          this.helperService.redirectApp(`dashboard/parametros/empleados`);
        }
      },
      (error) => {
        this.helperService.showMessage(MessageType.WARNING, error);
      }
    );
  }

  cancel() {
    this.helperService.redirectApp('dashboard/parametros/empleados');
  }

  nuevaPersona() {
    let modal = this.modalService.open(PersonasFormComponent, { size: 'lg', keyboard: false, backdrop: false, centered: true });
    modal.componentInstance.titleData = "Persona";
    modal.componentInstance.serviceName = "Persona";
    modal.componentInstance.key = "Ciudad";
    modal.result.finally(() => {
      this.listPersonas = signal<DataSelectDto[]>([]);

      setTimeout(() => {
        this.cargarPersonas(true);
      }, 200);
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
  declarations: [
    EmpleadosFormComponent,
  ],
  imports: [
    CommonModule,
    GeneralModule,
  ],
})
export class EmpleadosFormModule { }