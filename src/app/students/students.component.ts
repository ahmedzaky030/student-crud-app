import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { FormGroup , FormBuilder, Validators} from '@angular/forms';
import { StudentService } from '../student.service';
import { Subscription } from 'rxjs';
import { TouchSequence } from 'selenium-webdriver';
import { PageChangedEvent } from 'ngx-bootstrap/pagination/ngx-bootstrap-pagination';
import { pastDateValidator } from '../pastDateValidator';
import { ToastrService } from 'ngx-toastr';
 

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentComponent implements OnInit , OnDestroy {
  modalRef: BsModalRef;
  studentForm: FormGroup;
  students = [];
  visibleStudents = [];
  grades = [];
  classes = [];
  gradeListSub: Subscription;
  classListSub:Subscription;
  studentListSub: Subscription;
  isNew:boolean;
  isEditing:boolean;
  isDeleting:boolean;
  selectedStudent: any;
  modalBody:string;
  query:string;
  constructor(private modalService: BsModalService ,  private fb: FormBuilder , 
    private studentService : StudentService , private toastrService: ToastrService) {}
 
  ngOnInit(){
    
    this.studentForm = this.fb.group({
      fullName: this.fb.group({
        firstName:['',[Validators.required , Validators.minLength(2)]],
      lastName:['',[ Validators.required , Validators.minLength(2) ]],
      }),
      dateOfBirth:[new Date() ,[Validators.required , pastDateValidator()]],
      grade:['', Validators.required],
      class:['', Validators.required],
      nationalNo:['0', [Validators.minLength(10), Validators.maxLength(10)]],
      id:0
    })

   this.gradeListSub = this.studentService.getGradeList().subscribe(result => {
      
      let gradesArr = JSON.parse(result['_body']);
      this.grades = gradesArr;
    })

    this.getStudents();  
  }

  openModal(template: TemplateRef<any>, isEdit:boolean , id:number) {
    this.isEditing = isEdit;
    if(id){
    let student = this.students.find((v)=> v.id === id);
    let dateArr = student.dateOfBirth;
    this.getClass(student.currentGrade.id);
    student.dateOfBirth = new Date(Number(dateArr[0]),Number(dateArr[1]),Number(dateArr[2])).toDateString();
    
    this.selectedStudent = student;
    } else {
      this.isNew = true;
      this.selectedStudent = {};
    }
    this.modalRef = this.modalService.show(template);
  }

  openDeleteModal(template: TemplateRef<any>, obj:any){
    this.modalRef = this.modalService.show(template);
    this.modalBody = "Are you sure to remove " + obj.fullName.firstName +' '+ obj.fullName.lastName ; 
    
    
    this.selectedStudent = obj;
  }

  confirm(){
    this.isDeleting = true;
    this.studentService.deleteStudent(this.selectedStudent.id).subscribe(data => {
      this.modalBody = this.selectedStudent.fullName.firstName + ' has been deleted successfully';
      this.toastrService.success(this.modalBody);
      this.visibleStudents = this.visibleStudents.filter((v)=> v.id !== this.selectedStudent.id );
      setTimeout(() => {
        this.modalRef.hide();
        this.isDeleting = false;
      }, 2000)
      this.studentService.getStudentList();
    })
    
  }
  pageChanged(event: PageChangedEvent): void {
    
    
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.visibleStudents = this.students.slice(startItem, endItem);

  }

  cancel(){
    this.selectedStudent = null;
    this.modalRef.hide();
  }

  getStudents(){
    this.studentListSub = this.studentService.getStudentList().subscribe(result => {
      
      let studentArr = JSON.parse(result['_body']);
      
      this.students = studentArr;
      this.visibleStudents = studentArr.slice(0,6);
    })
  }

  
  submit(form:FormGroup){
    console.log(form);
    
    let studentObj = form.value;
    studentObj.currentGrade = this.grades.find((v)=> v.id == studentObj.grade);
    studentObj.currentClassRoom = this.classes.find((v)=> v.id == studentObj.class);
    delete studentObj.class;
    delete studentObj.grade;
    
    if(this.isNew){
      this.studentService.createStudent(studentObj).subscribe(result => {
        this.getStudents();
        this.toastrService.success('Date saved successfully')
        this.modalRef.hide()
      })

      
    }
    if(this.isEditing){
      this.studentService.updateStudent(studentObj).subscribe(result => {          
        this.getStudents(); 
        this.toastrService.success('Date saved successfully')
        this.studentForm.reset();
        this.modalRef.hide();

      })
    }

  } 

  getClass(id:number){    
    this.classListSub = this.studentService.getClassesListByGradeId(id).subscribe(result => {
      let classesArr = JSON.parse(result['_body']);
      this.classes = classesArr;    
    });
  }
  getResult(){
    this.visibleStudents = this.students.filter((v)=> {
       return v.fullName.firstName.toLowerCase().includes(this.query) || v.fullName.lastName.toLowerCase().includes(this.query)
       || v.currentGrade.gradeDescription.toLowerCase().includes(this.query) || v.nationalNo.includes(this.query) 
    })  
  }

  enter(event){
    
    if(event.keyCode == 13){
      this.getResult();
    }
  }

  ngOnDestroy(){
    if(this.classListSub) this.classListSub.unsubscribe();
    if(this.gradeListSub) this.gradeListSub.unsubscribe();
    if(this.studentListSub) this.studentListSub.unsubscribe();
  }

}

class Student {
  public fullName:FullName = new FullName() ;
  public dateOfBirth:string;
  public id: number;
  public currentGrade : Grade = new Grade();
  public currentClassRoom:ClassRoom = new ClassRoom();
}

class FullName {
  public firstName: string;
  public lastName: string
}

class Grade {
  public gradeDescription:string;
  public id:string;
}

class ClassRoom{
  public classRoomName:string;
  public id:string;
  public classGrade:Grade;
}
