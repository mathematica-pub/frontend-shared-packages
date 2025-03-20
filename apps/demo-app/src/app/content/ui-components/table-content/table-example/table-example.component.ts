import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  HsiUiTableDataSource,
  TableColumnsBuilder,
  TableModule,
} from '@hsi/ui-components';
import { of } from 'rxjs';

enum ColumnNames {
  fruitName = 'fruit name',
  color = 'color',
}

enum FruitInfo {
  fruit = 'fruit',
  color = 'color',
}

@Component({
  selector: 'app-table-example',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './table-example.component.html',
  styleUrls: ['../../../examples.scss', './table-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExampleComponent implements OnInit {
  @Input() sortIcon: string = 'arrow_upward';
  dataSource: HsiUiTableDataSource<{ fruit: string; color: string }>;

  ngOnInit(): void {
    this.setTableData();
  }

  setTableData() {
    const initData$ = of([
      { fruit: 'lemon', color: 'yellow' },
      { fruit: 'mango', color: 'orange' },
      { fruit: 'avocado', color: 'green' },
      { fruit: 'apple', color: 'red' },
      { fruit: 'orange', color: 'orange' },
      { fruit: 'banana', color: 'yellow' },
    ]);
    const initColumns$ = of(
      new TableColumnsBuilder<{ fruit: string; color: string }>()
        .addColumn((column) =>
          column
            .label(ColumnNames.fruitName)
            .key(FruitInfo.fruit)
            .ascendingSortFunction((a, b) => a.fruit.localeCompare(b.fruit))
            .sortOrder(1)
            .sortable(true)
            .sortDirection('asc') // initial sort direction
            .getFormattedValue((x) => x.fruit)
        )
        .addColumn((column) =>
          column
            .key(FruitInfo.color)
            .label(ColumnNames.color)
            .sortable(true)
            .ascendingSortFunction((a, b) => a.color.localeCompare(b.color))
            .getFormattedValue((x) => x.color)
        )
        .getConfig()
    );
    this.dataSource = new HsiUiTableDataSource(initData$, initColumns$);
  }
}
