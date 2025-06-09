import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-activate',
    templateUrl: './activate.component.html',
    styleUrls: ['./activate.component.scss', '../../app.component.scss'],
})
export class ActivateComponent implements OnInit {
    status: 'loading' | 'success' | 'error' = 'loading';

    constructor(private http: HttpClient, private route: ActivatedRoute) { }

    ngOnInit(): void {
        // sleep for 3 seconds to simulate loading
        setTimeout(() => {
            this.verifyEmail();
        }, 3000);
    }
    verifyEmail(): void {
        // Get the token from the query parameters
        const token = this.route.snapshot.queryParamMap.get('token');
        if (token) {
            this.http.get('/api/auth/verify-email?token=' + token, { observe: 'response' }).subscribe({
                next: (res) => {
                    this.status = res.status === 204 ? 'success' : 'error';
                },
                error: () => {
                    this.status = 'error';
                }
            });
        } else {
            this.status = 'error';
        }
    }

}

