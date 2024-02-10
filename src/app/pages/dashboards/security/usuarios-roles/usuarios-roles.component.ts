import { Component, Input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LANGUAGE_DATATABLE } from 'src/app/admin/datatable.language';
import { HelperService, Messages, MessageType } from 'src/app/admin/helper.service';
import { GeneralParameterService } from '../../../../generic/general.service';
import { DatatableParameter } from '../../../../admin/datatable.parameters';
import { DataSelectDto } from '../../../../generic/dataSelectDto';
import { UsuarioRol } from './usuarios-roles.module';

@Component({
  selector: 'app-usuarios-roles',
  standalone: false,
  templateUrl: './usuarios-roles.component.html',
  styleUrl: './usuarios-roles.component.css'
})
export class UsuariosRolesComponent implements OnInit {
  botones = ['btn-guardar'];
  @Input() UsuarioId: any = null;
  frmUsuariosRol: FormGroup;
  statusForm: boolean = true;
  listRoles = signal<DataSelectDto[]>([]);
  listUsuariosRoles = signal<UsuarioRol[]>([]);

  constructor(
    private helperService: HelperService,
    private service: GeneralParameterService
  ) {
    this.frmUsuariosRol = new FormGroup({
      Id: new FormControl(0, Validators.required),
      UsuarioId: new FormControl(this.UsuarioId, Validators.required),
      RolId: new FormControl(null, Validators.required),
      Activo: new FormControl(true, Validators.required),
    });
  }

  ngOnInit(): void {
    this.cargarLista();
    this.cargarRoles();
  }

  cargarRoles() {
    this.service.getAll('Rol').subscribe((res) => {
      res.data.forEach((item: any) => {
        this.listRoles.update(listRoles => {
          const DataSelectDto: DataSelectDto = {
            id: item.id,
            textoMostrar: `${item.codigo} - ${item.nombre}`,
            activo: item.activo
          };

          return [...listRoles, DataSelectDto];
        });
      });
    });
  }

  cargarLista() {
    this.getData()
    .then((datos) => {
      datos.data.forEach((item: any) => {
        this.listUsuariosRoles.update(listUsuariosRoles => {
          const UsuarioRol: UsuarioRol = {
            id: item.id,
            activo: item.activo,
            usuarioId: item.usuarioId,
            usuario: item.usuario,
            rolId: item.rolId,
            rol: item.rol,
          };

          return [...listUsuariosRoles, UsuarioRol];
        });
      });

      setTimeout(() => {
        $("#datatable").DataTable({
          dom: 'Blfrtip',
          destroy: true,
          language: LANGUAGE_DATATABLE,
          processing: true
        });
      }, 200);
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
    });
  }

  getData(): Promise<any> {
    var data = new DatatableParameter(); data.pageNumber = ""; data.pageSize = ""; data.filter = ""; data.columnOrder = ""; data.directionOrder = ""; data.foreignKey = this.UsuarioId; data.nameForeignKey = "UsuarioId";
    return new Promise((resolve, reject) => {
      this.service.datatableKey("UsuarioRol", data).subscribe(
        (datos) => {
          resolve(datos);
        },
        (error) => {
          reject(error);
        }
      )
    });
  }

  refrescarTabla() {
    $("#datatable").DataTable().destroy();
    this.listUsuariosRoles = signal<UsuarioRol[]>([]);
    this.cargarLista();
  }

  save() {
    this.frmUsuariosRol.controls['UsuarioId'].setValue(this.UsuarioId);
    if (this.frmUsuariosRol.invalid) {
      this.statusForm = false;
      this.helperService.showMessage(MessageType.WARNING, Messages.EMPTYFIELD);
      return;
    }
    let data = this.frmUsuariosRol.value;
    this.service.save("UsuarioRol", this.frmUsuariosRol.controls['Id'].value, data).subscribe(
      (response) => {
        if (response.status) {
          this.refrescarTabla();
          this.frmUsuariosRol.reset();
          this.frmUsuariosRol.controls['Id'].setValue(0);
          this.helperService.showMessage(
            MessageType.SUCCESS,
            Messages.SAVESUCCESS
          );
        }
      },
      (error) => {
        this.helperService.showMessage(
          MessageType.WARNING,
          error
        );
      }
    );
  }

  update(item: any) {
    this.frmUsuariosRol.controls['Id'].setValue(item.id);
    this.frmUsuariosRol.controls['RolId'].setValue(item.rolId);
    this.frmUsuariosRol.controls['Activo'].setValue(item.activo);
  }

  deleteGeneric(id: any) {
    this.helperService.confirmDelete(() => {
      this.service.delete("UsuarioRol", id).subscribe(
        (response) => {
          if (response.status) {
            this.helperService.showMessage(MessageType.SUCCESS, Messages.DELETESUCCESS);
            this.refrescarTabla();
          }
        },
        (error) => {
          this.helperService.showMessage(MessageType.WARNING, error);
        }
      )
    });
  }
}