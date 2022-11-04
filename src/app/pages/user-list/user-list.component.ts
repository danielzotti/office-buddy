import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../api/user-api.service';
import { DbUserWithKey, User, UserWithKey } from '../../models/user.models';
import { catchError, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'ob-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  // UI
  isLoading = true;

  // USERS
  users$: Observable<UserWithKey[]> | undefined;

  constructor(
    private userApiService: UserApiService,
  ) {
  }

  ngOnInit(): void {
    this.users$ = this.userApiService.getList().pipe(
      tap(_ => this.isLoading = false),
      catchError((err) => {
        console.error({ err });
        this.isLoading = false;
        return of([]);
      })
    );
  }

  openUpdateUserModal(user: DbUserWithKey) {
    // TODO
    console.log('openUpdateUserModal', user);
  }

  deleteUser(user: DbUserWithKey) {
    // TODO
    console.log('deleteUser', user);
  }
}
