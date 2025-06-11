import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-activate',
    templateUrl: './activate.component.html',
    styleUrls: ['./activate.component.scss', '../../app.component.scss'],
})
export class ActivateComponent implements OnInit {
    status: 'loading' | 'success' | 'error' = 'loading';
    token: string | null = null;

    constructor(private auth: AuthService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.verifyEmail();
    }

    retry(): void {
        this.status = 'loading';
        this.verifyEmail();
    }

    verifyEmail(): void {
        this.token = this.route.snapshot.queryParamMap.get('token');
        if (this.token) {
            // Get the token from the query parameters
            if (!this.token) {
                this.status = 'error';
                return;
            }
            this.auth.verifyEmail(this.token).subscribe(
                (res: any) => {
                    this.status = res.status === 200 ? 'success' : 'error';
                },
                () => {
                    this.status = 'error';
                }
            );
        } else {
            this.status = 'error';
        }
    }

}

