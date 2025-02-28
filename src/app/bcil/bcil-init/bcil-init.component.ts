import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { mouModel } from '../../model/mou.model';
import { Role } from 'src/app/model/role.model';
import { UserEdit } from 'src/app/model/user-edit.model';
import { User } from 'src/app/model/user.model';
import { Router } from '@angular/router';
import { Bdoservice } from '../../services/bdo.service'
import { Utilities } from '../../services/utilities';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { nodalOfficer, UploadFileViewModel } from '../../model/uploadFile.model'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../../services/account.service';
import { Departments } from 'src/app/model/department';
import { AlertService, DialogType, MessageSeverity } from 'src/app/services/alert.service';
import { Permission } from 'src/app/model/permission.model';
import { StringDecoder } from 'string_decoder';

@Component({
  selector: 'app-bcil-init',
  templateUrl: './bcil-init.component.html',
  styleUrls: ['./bcil-init.component.css']
})
export class BcilInitComponent implements OnInit {
  mouModel: mouModel[];
  mouModel1: mouModel;
  showpage = false;
  type: string;
  closeResult = '';
  ForwardForm: FormGroup;
  submitted = false;
  createdBy = "";
  UploadFileViewModel = new UploadFileViewModel();
  
  @ViewChild('editorModal1', { static: true })
  editorModal1: ModalDirective;
  usertype: string;
  UserName: string;
  showClientPage = false;
  @ViewChild('editorModal2', { static: true })
  editorModal2: ModalDirective;
  UserEmail: string;
  UserId: string;
  userRoles: string[];
  isAdmin: boolean;
  formHeader: string;
  isBdm: boolean;
  isLM: boolean;
  isIPM:boolean;
  users: User[] = [];
  rows: User[] = [];
  rowsCache: User[] = [];
  departments: Departments[] = [];
  editedUser: UserEdit;
  userview: any[] = [];
  usermanage: any[] = [];
  roleassign: any[] = [];
  allRoles: Role[] = [];
  loadingIndicator: boolean;
  user: any;
permission:boolean;
permissionbutton1:boolean;
permissionbutton2:boolean;
moucreatedby_role:string;
mouref:string;
forword=false;
nodalofficer:string;
customrem:boolean;
  array = [{tabelname:"Initiation- to be suggested by client", name: 'init', value: 'S101', createdBy: "Test1",forwordtitle:"Forward to LM", forward: "S102", forwardCheck: true, type: true,forwardText: 'Forward', back: true,backbuttonText: 'Agreement not needed',backStatus: "S107",permissionbutton1:this.Canviewagreement_not_needed_forword_buttonPermission,permissionforword:this.CanviewMou_init_forword_button_Permission },
  {tabelname:"MOU Pending", name: 'mou_pending', value: 'S102', createdBy: "Tes2", forward: "S104",forwordtitle:"Forward to Admin", forwardCheck: true, forwardText: 'Forward', back: false,permissionforword:this.CanviewMou_pending_forword_buttonPermission },
  {tabelname:"MOU Change Required By Admin", name: 'mou_change_by_admin', value: 'S103', createdBy: "Tes3", forward: "S104", forwardCheck: true, forwardText: 'Forward', back: true,permissionforword:this.CanviewMou_change_by_admin_forword_buttonPermission },
  {tabelname:"MOU Proposed By Legal Manager", name: 'mou_porposed_by_lm', value: 'S104', createdBy: "Tes4",forwordtitle:"Forward to BDM/IPM",backtitle:"Forward to LM", forward: "S110", forwardCheck: false, forwardText: 'Forward', back: true, backStatus: "S103",approvetitle:"Forward to Bdo/IPM", approvedvalue: 'S110', approved: true, approvedText: "Approved", backbuttonText: 'Change Req',permissionforword:this.CanviewMou_proposed_by_lm_forword_buttonPermission ,permissionbutton1:this.CanviewMou_proposed_by_lm_change_required_buttonPermission},
  { tabelname:"Agreement Signed",name: 'agreementsigned', value: 'S105', createdBy: "Tes5", forward: "S107", forwardCheck: true, forwardText: 'Forward', back: false, permissionforword:this.CanviewAgreementsigned_forwprd_buttonPermission },
  { tabelname:"MOU Accepted by Client",name: 'mou_accepted_by_client', value: 'S106', createdBy: "Tes6", forward: "S105", forwardCheck: true, forwardText: 'Forward', back: false ,permissionforword:this.CanviewMou_accepted_by_client_forword_buttonPermission},
  { tabelname:"Business Development Manager Assiged",name: 'bodassigned', value: 'S107', createdBy: "Tes4", forward: "S108", forwardCheck: true, forwardText: 'Forward', back: false ,permissionforword:this.Canviewbdoassigned_forword_buttonPermission},
  { tabelname:"TTO Req Approved",name: 'tto_req_approved', value: 'S108', createdBy: "Tes5", forward: "S109", forwardCheck: true, forwardText: 'Forward', back: false ,permissionforword:this.Canviewtto_req_approved_forword_buttonPermission},
  { tabelname:"IP Manager Assigned",name: 'ipm_assigned', value: 'S109', createdBy: "Tes6", forward: "S108", forwardCheck: true, forwardText: 'Forward', back: false,permissionforword:this.Canviewip_manager_assigned_forword_buttonPermission },
 { tabelname:"MOU Proposed by Admin",name: 'mou_proposed_by_admin', value: 'S110', createdBy: "Tes6", forward: "S106",forwordtitle:"Forward to LM", forwardCheck: true, forwardText: 'Forward', back: true,backtitle:'Forward to Admin', backStatus: "S112", backbuttonText: 'Mou Change By Client',permissionforword:this.CanviewMou_accepted_by_client_forword_buttonPermission,permissionbutton1:this.CanviewMou_proposed_by_admin_client_request_changePermissionPermission },
  { tabelname:"MOU Change By Client",name: 'mou_change_by_client', value: 'S111', createdBy: "Tes3", forward: "S103", forwardCheck: true, forwardText: 'Forward', back: false,permissionforword:this.Canviewbdoassigned_forword_buttonPermission },
  //{ name: 'mou_approved_by_admin', value: 'S112', createdBy: "Tes3", forward: "S106", forwardCheck: true, forwardText: 'Forword', back: false },
  {tabelname:"init", name: 'tta_init', value: 'S113', createdBy: "Tes3", forward: "S106", forwardCheck: true, forwardText: 'Forward', back: false ,permissionforword:this.Canviewbdoassigned_forword_buttonPermission},
  ]


  
  activearray = this.array[0];

  constructor(private route: ActivatedRoute, private Bdoservice: Bdoservice, private formbuilder: FormBuilder, private _cookieService: CookieService, private accountService: AccountService, private router: Router, private alertService: AlertService) {


    this.UserEmail = this.accountService.currentUser.email;
    this.UserId = this.accountService.currentUser.id;
    this.userRoles = this.accountService.currentUser.roles;

    this.accountService.getUsersandRolesForDropdown().subscribe(results => this.onDataLoadSuccessful(results[0], results[1]), error => this.onDataLoadFailed(error));
    
this.customrem=false;
    
  }
  reminderchange(data){
if(data=="default"){
  this.customrem=false;
}

else if(data=="custom"){
  this.customrem=true;
  //this.editorModal2.show();

}
  }
  get Canviewagreement_not_needed_forword_buttonPermission() {
    return this.accountService.userHasPermission(Permission.viewagreement_not_needed_forword_buttonPermission);
  }
  
  
get CanviewMou_init_forword_button_Permission() {
  return this.accountService.userHasPermission(Permission.viewMou_init_forword_button_Permission);
}
get CanviewMou_pending_forword_buttonPermission() {
  return this.accountService.userHasPermission(Permission.viewMou_pending_forword_buttonPermission);
}

get CanviewMou_proposed_by_admin_client_request_changePermissionPermission() {
  return this.accountService.userHasPermission(Permission.viewMou_proposed_by_admin_client_request_changePermission);
}

get CanviewMou_proposed_by_admin_client_approvedPermission() {
  return this.accountService.userHasPermission(Permission.viewMou_proposed_by_admin_client_approvedPermission);
}

get CanviewMou_change_by_admin_forword_buttonPermission() {
  return this.accountService.userHasPermission(Permission.viewMou_change_by_admin_forword_buttonPermission);
}

get CanviewMou_proposed_by_lm_forword_buttonPermission() {
  return this.accountService.userHasPermission(Permission.viewMou_proposed_by_lm_forword_buttonPermission);
}
get CanviewMou_proposed_by_lm_change_required_buttonPermission() {
  return this.accountService.userHasPermission(Permission.viewMou_proposed_by_lm_change_required_buttonPermission);
}
get CanviewMou_accepted_by_client_forword_buttonPermission() {
  return this.accountService.userHasPermission(Permission.viewMou_accepted_by_client_forword_buttonPermission);
}
get CanviewAgreementsigned_forwprd_buttonPermission() {
  return this.accountService.userHasPermission(Permission.viewAgreementsigned_forword_buttonPermission);
}
get Canviewbdoassigned_forword_buttonPermission() {
  return this.accountService.userHasPermission(Permission.viewbdoassigned_forword_buttonPermission);
}
get Canviewtto_req_approved_forword_buttonPermission() {
  return this.accountService.userHasPermission(Permission.viewtto_req_approved_forword_buttonPermission);
}
get Canviewip_manager_assigned_forword_buttonPermission() {
  return this.accountService.userHasPermission(Permission.viewip_manager_assigned_forword_buttonPermission);
}



  ngOnInit(): void {
    this.isLM = this.userRoles.includes('LM');
    this.isAdmin = this.userRoles.includes('Admin');
    this.isBdm = this.userRoles.includes('BDM');

  this.isIPM=this.userRoles.includes('IPM');
    this.route.queryParams.subscribe((params) => {

        this.createdBy = this.UserId;

        this.type = this.array.find(x => x.name == params.type).value;
        this.activearray = this.array.find(x => x.name == params.type);
        this.permission=this.array.find(x => x.name == params.type).permissionforword;
        this.permissionbutton1=this.array.find(x => x.name == params.type).permissionbutton1;
        //this.createdBy = this.array.find(x => x.name == params.type).createdBy;
      

    })
    this.Bdoservice.GetMou().subscribe(data => {
      console.log(data)
      debugger
      if(this.isBdm ||this.isIPM){
        this.mouModel = data.filter(x => x.app_Status == this.type &&  x.createdBy==this.UserId);
      }
      else{
      this.mouModel = data.filter(x => x.app_Status == this.type &&  (x.createdBy==this.UserId ||  x.assigntoadmin==this.UserId||
        x.assignto==this.UserId || x.app_Status=='S101'));
      }

      
        this.showpage = true;
     

    })

    

    this.ForwardForm = this.formbuilder.group({

      subject: ['', Validators.required],
      remarks: [''],
      remindertype:['default',Validators.required],
      type: [''],
      assignto:[''],
    });
  }
  get f() { return this.ForwardForm.controls; }
  fileChangeEvent(event) {
    if (event.target.files && event.target.files[0]) {
      const fileUpload = event.target.files[0];
      const filee = fileUpload.files;
      this.UploadFileViewModel.fileFullName = fileUpload.name;

      const sFileExtension = fileUpload.name
        .split('.')
      [fileUpload.name.split('.').length - 1].toLowerCase();
      Utilities.getBase64(event.target.files[0]).then((data) => {
        console.log(data);
        this.UploadFileViewModel.fileType = '.' + sFileExtension;

        let data1: any = data;
        let contentType = data1?.split(',')[1];

        this.UploadFileViewModel.file64 = contentType;
      });
    }
  }
  uploadFile() {

    this.submitted = true;

    
    if(this.type=="S107"||this.type=="S109"){
      //create nodal
      console.log('dd')
      this.UploadFileViewModel.nodal=new nodalOfficer();
      this.UploadFileViewModel.nodal.nodal_name=this.mouModel1?.nodal_Name;
      this.UploadFileViewModel.nodal.nodal_email=this.mouModel1?.nodal_Email;
      this.UploadFileViewModel.nodal.nodal_mobile=this.mouModel1?.nodal_Mobile_No;
    }
    this.UploadFileViewModel.subject = this.ForwardForm.get('subject').value;
    this.UploadFileViewModel.remarks = this.ForwardForm.get('remarks').value;
    this.UploadFileViewModel.type = this.ForwardForm.get('type').value;
    this.UploadFileViewModel.assignto = this.ForwardForm.get('assignto').value;
    this.UploadFileViewModel.remindertype = this.ForwardForm.get('remindertype').value;
//this.UploadFileViewModel.assigntoadmin= this.UploadFileViewModel.createdBy;
    this.UploadFileViewModel.createdBy = this.UserId;

    console.log(this.UploadFileViewModel);
    this.Bdoservice.uploadfile(this.UploadFileViewModel).subscribe((event) => {

      alert("Application Forward Successfully")
      this.editorModal1.hide();
      this.ngOnInit();

    })


  }

  onmodalclick(e: string, data: mouModel) {
   
    this.UploadFileViewModel.app_Status = e == "approve" ? this.array.find(x => x.value == this.type).approvedvalue :
     e== "forword" ? this.array.find(x => x.value == this.type).forward : this.array.find(x => x.value == this.type).backStatus;
    this.UploadFileViewModel.app_ref_id = data.refid;
    this.mouref=data.refid;
debugger;
    this.mouModel1= this.mouModel.find(x=>x.refid==data.refid);
    this.moucreatedby_role=this.users.find(x=>x.id==this.mouModel1.createdBy)?.roles[0];
   this.forword=e=="forword"?true:false;
if((this.type=="S101" &&e=="back") ||this.type=="S105"){
 this.moucreatedby_role=="IPM"?this.UploadFileViewModel.app_Status="S109":
   this.moucreatedby_role=="IBM"?this.UploadFileViewModel.app_Status="S107":null;
  
}



   console.log(this.mouModel1)


    if (e == "forword" || e == "back") {
      this.editorModal1.show();
    }
    else if ("approve") {
      this.Bdoservice.uploadfile(this.UploadFileViewModel).subscribe((event) => {

        alert("Application Approved Successfully")
        //this.editorModal1.hide();
        this.ngOnInit();
      })

    }
   
  }

  onDataLoadSuccessful(users: User[], roles: Role[]) {

   // this.accountService.getRoles(0, 0).subscribe(data => { })
    console.log(users, roles)
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    let rol = [];
    let rol1 = [];
    debugger;

    
    this.allRoles = roles;

    users.forEach((user, index) => {
      (user as any).index = index + 1;
    });

   
    this.rowsCache = [...users];
    this.users=users;

    console.log(this.users,'users')
    this.rows = users.filter(x => x.roles.includes('LM'));



  }

  onDataLoadFailed(error: any) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;

    this.alertService.showStickyMessage('Load Error', `Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
      MessageSeverity.error, error);
  }

}
