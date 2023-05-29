import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { GLanguageService } from 'src/app/core/services/baseAPI/g-language.service';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-g-language',
  templateUrl: './g-language.component.html',
  styleUrls: ['./g-language.component.scss']
})
export class GLanguageComponent {

  popup: any = {
    component: null,
    data: null,
  };

  constructor(
    private formBuilder: FormBuilder,
    public gLanguageService: GLanguageService,
    private loadingService: LoadingService
  ) {}

  addPopupHandler() {
    this.popup.data = {
      mode: 'add',
      initData: {},
    };
    this.popup.component = 'add';
  }

  async editPopupHandler(rowData: any) {
    let body = {
      lang_Code: rowData.lang_Code,
    };

    this.loadingService.startLoading();

    try {
      let res = await firstValueFrom(this.gLanguageService.getDetail(body));
      const { status } = res;

      if (status !== '999') {
        return;
      }

      this.popup.data = {
        mode: 'edit',
        initData: res.data,
      };

      this.popup.component = 'add';
    } catch (error) {
      console.log(error);
    } finally {
      this.loadingService.stopLoading();
    }
  }

  deactivatePopupHandler() {
    let selectedData = this.gLanguageService
      .getTabulatorTable()
      .getSelectedData();
    if (selectedData.length === 0) {
      alert('請選擇資料');
      return;
    }
    this.popup.data = {};
    this.popup.component = 'deactivate';
  }

  async deactivateHandler() {
    let selectedData = this.gLanguageService
      .getTabulatorTable()
      .getSelectedData();

      let body: any = {
      lCIn_ConvertState_PageData: selectedData.map(item => {
        return {
          lPk: item.lang_Code,
          sName: item.lang_Name
        }
      }),
      sState: '0',
    };

    this.loadingService.startLoading();

    try {
      let res = await firstValueFrom(this.gLanguageService.convertState(body));
      const { status } = res;
      if (status === '999') {
        let searchRes = await firstValueFrom(this.gLanguageService.search());
        this.gLanguageService.getTabulatorTable().setData(searchRes.data ?? []);
        this.popup.component = null;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.loadingService.stopLoading();
    }
  }
}