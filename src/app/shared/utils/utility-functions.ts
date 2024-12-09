export class NumberToWords {
    private units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    private tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    private scales = ['', 'Thousand', 'Lakh', 'Crore'];

    convertNumberToWords(num: number): string {
        if (num === 0) return 'Zero';

        let words = '';

        if (Math.floor(num / 10000000) > 0) {
            words += this.convertNumberToWords(Math.floor(num / 10000000)) + ' Crore ';
            num %= 10000000;
        }

        if (Math.floor(num / 100000) > 0) {
            words += this.convertNumberToWords(Math.floor(num / 100000)) + ' Lakh ';
            num %= 100000;
        }

        if (Math.floor(num / 1000) > 0) {
            words += this.convertNumberToWords(Math.floor(num / 1000)) + ' Thousand ';
            num %= 1000;
        }

        if (Math.floor(num / 100) > 0) {
            words += this.convertNumberToWords(Math.floor(num / 100)) + ' Hundred ';
            num %= 100;
        }

        if (num > 0) {
            if (num < 20) {
                words += this.units[num];
            } else {
                words += this.tens[Math.floor(num / 10)];
                if (num % 10 > 0) {
                    words += '-' + this.units[num % 10];
                }
            }
        }

        return words.trim();
    }

    // Convert the amount to words with Rupees and Paise
    convertAmountToWords(amount: number): string {
        const integerPart = Math.floor(amount);
        const decimalPart = Math.round((amount - integerPart) * 100);

        let amountInWords = this.convertNumberToWords(integerPart);

        if (decimalPart > 0) {
            amountInWords += ' and ' + this.convertNumberToWords(decimalPart);
        }

        return amountInWords + ' Only';
    }
}