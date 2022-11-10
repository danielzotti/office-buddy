import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../api/user-api.service';
import { DbUserWithKey, User, UserWithKey } from '../../models/user.models';
import { catchError, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'ob-user-list-page',
  templateUrl: './user-list-page.component.html',
  styleUrls: ['./user-list-page.component.scss']
})
export class UserListPageComponent implements OnInit {

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
