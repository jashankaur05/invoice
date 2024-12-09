import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TruncatePipe } from 'src/app/shared/pipes/truncate/truncate.pipe';

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  templateUrl: './files-list.component.html',
  styleUrl: './files-list.component.scss'
})
export class FilesListComponent {
  @Input() files: any[] = []
  @Output() deleteFile: EventEmitter<File> = new EventEmitter<File>();

  removeFile(event: Event, file: any) {
    event.stopPropagation();
    this.deleteFile.emit(file);
  }
}
