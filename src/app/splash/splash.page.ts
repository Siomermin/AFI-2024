import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  public router = inject(Router);
  public renderer = inject(Renderer2);

  @ViewChild('integrante1') integrante1!: ElementRef;
  @ViewChild('integrante2') integrante2!: ElementRef;
  @ViewChild('integrante3') integrante3!: ElementRef;
  @ViewChild('imgElement') imgElement!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => {
      this.renderer.addClass(this.integrante1.nativeElement, 'shake-vertical');
      this.renderer.addClass(this.integrante2.nativeElement, 'shake-vertical');
      this.renderer.addClass(this.integrante3.nativeElement, 'shake-vertical');

      this.renderer.addClass(
        this.imgElement.nativeElement,
        'wobble-horizontal-bottom'
      );
    }, 3000);

    setTimeout(() => {
      this.router.navigateByUrl('auth/login');
    }, 4000);
  }
}
