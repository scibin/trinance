import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessService } from '../services/access.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private accSvc: AccessService) { }

  ngOnInit() {

  }
}
