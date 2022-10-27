import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../api/user-api.service';
import { User } from '../../models/user.models';

@Component({
  selector: 'ob-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: Array<User> = [];

  constructor(private userApiService: UserApiService,
  ) {
  }

  ngOnInit(): void {
    this.userApiService.getList().subscribe(users => this.users = users);
  }

}
