import { Presenter } from "./Presenter";

export class JsonPresenter implements Presenter {
  present(data: any) {
    return data;
  }

}