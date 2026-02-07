import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    getNumberOfPages(): number;
  }
}
