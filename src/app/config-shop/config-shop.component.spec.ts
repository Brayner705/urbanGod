import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigShopComponent } from './config-shop.component';

describe('ConfigShopComponent', () => {
  let component: ConfigShopComponent;
  let fixture: ComponentFixture<ConfigShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigShopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
