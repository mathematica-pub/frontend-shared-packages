import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { GetValueByKeyPipe } from '@hsi/app-dev-kit';
import {
  HsiUiTableDataSource,
  TableColumnsBuilder,
  TableModule,
} from '@hsi/ui-components';
import { of } from 'rxjs';

enum ColumnNames {
  fruit = 'Fruit',
  colorName = 'Color',
  inventory = 'Inventory',
  price = 'Sell price',
}

enum FruitInfo {
  fruit = 'fruit',
  colorName = 'color',
  inventory = 'metrics.inventory',
  price = 'metrics.price',
}

class FruitType {
  fruit: string;
  color: string;
  metrics: {
    inventory: number;
    price: number;
  };
}

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [CommonModule, TableModule, GetValueByKeyPipe],
  templateUrl: './table-example.component.html',
  styleUrls: ['../../../examples.scss', './table-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExampleComponent implements OnInit {
  @Input() sortIcon: string = 'arrow_upward';
  dataSource: HsiUiTableDataSource<FruitType>;

  ngOnInit(): void {
    this.setTableData();
  }

  setTableData() {
    const initData$ = of([
      {
        fruit: 'lemon',
        color: 'yellow',
        metrics: { inventory: 10, price: 1.2 },
      },
      {
        fruit: 'mango',
        color: 'orange',
        metrics: { inventory: 5, price: 2.5 },
      },
      {
        fruit: 'avocado',
        color: 'green',
        metrics: { inventory: 20, price: 3.0 },
      },
      {
        fruit: 'apple',
        color: 'red',
        metrics: { inventory: 15, price: 1.5 },
      },
      {
        fruit: 'orange',
        color: 'orange',
        metrics: { inventory: 20, price: 1.8 },
      },
      {
        fruit: 'banana',
        color: 'yellow',
        metrics: { inventory: 5, price: 1.0 },
      },
    ]);
    const initColumns$ = of(
      new TableColumnsBuilder<FruitType>()
        .addColumn(
          (column) =>
            column
              .label(ColumnNames.fruit)
              .cssClass('left')
              .displayKey(FruitInfo.fruit)
              .ascendingSortFunction((a, b) => a.fruit.localeCompare(b.fruit))
              .sortOrder(1)
              .sortable(true)
              .sortDirection('asc') // initial sort direction
        )
        .addColumn((column) =>
          column
            .displayKey(FruitInfo.colorName)
            .label(ColumnNames.colorName)
            .cssClass('left')
            .sortable(true)
            .ascendingSortFunction((a, b) => a.color.localeCompare(b.color))
        )
        .addColumn((column) =>
          column
            .displayKey(FruitInfo.inventory)
            .label(ColumnNames.inventory)
            .cssClass('right')
            .sortable(true)
            .getSortValue((x) => x.metrics.inventory)
        )
        .getConfig()
    );
    this.dataSource = new HsiUiTableDataSource(initData$, initColumns$);
  }
}
