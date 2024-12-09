import { Pipe, PipeTransform } from '@angular/core';

const FILE_SIZE_UNITS: string[] = ['B', 'KB', 'MB', 'GB'];

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizeFormatterPipe implements PipeTransform {
  /**
     * Converts the filesize of a file from bytes to the corresponding size up to 2 decimals
     *
     * @param sizeInBytes size of a file in Bytes
     */
  transform(sizeInBytes: number): string {
    const units: string[] = FILE_SIZE_UNITS;

    let power: number = Math.round(Math.log(sizeInBytes) / Math.log(1024));
    power = Math.min(power, units.length - 1);

    const size: number = sizeInBytes / Math.pow(1024, power); // size in new units
    const formattedSize: number = Math.round(size * 100) / 100; // keep up to 2 decimals
    const unit: string = units[power];

    return size ? `${formattedSize} ${unit}` : '';
  }

}
