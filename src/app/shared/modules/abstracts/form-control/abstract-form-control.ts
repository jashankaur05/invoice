import {
    ChangeDetectorRef,
    Directive,
    OnDestroy,
    OnInit,
    Optional,
    Self,
  } from '@angular/core';
  import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    NgControl,
  } from '@angular/forms';
  import { Subject, Subscription } from 'rxjs';
  import { takeUntil } from 'rxjs/operators';
  
  /**
   * Function to create the basic provider to components which use `ngModel` as required by Angular.
   *
   * @param F syncForm type (mostly FormControl, FormGroup, FormArray)
   * @param T value type
   * @param FT syncform value type (optional if mappers are needed)
   */
  @Directive()
  export abstract class AbstractFormControlComponent<
    F extends AbstractControl,
    T,
    FT = T,
  >implements ControlValueAccessor, OnInit, OnDestroy
  {
    public disabled = false;
    public syncForm: F | undefined ;
    private _value: T | undefined;
  
    public get control(): FormControl {
      return (this.ngControl?.control ?? this.dummyControl) as FormControl;
    }
  
    public get value(): T  | undefined {
      return this._value;
    }
    public set value(val: T | undefined) {
      if (this._value === val) {
        return;
      }
      this._value = val;
    }
  
  
    protected syncFormBuilder: ((data: T) => F) | undefined;
    protected mapToForm: ((data: T) => FT) | undefined;
    protected mapFromForm: ((data: FT) => T) | undefined;
  
    protected destroy$: Subject<boolean> = new Subject<boolean>();
  
  
    private syncFormValueSubscription: Subscription | undefined;
    private syncFormStatusSubscription: Subscription | undefined;
  
    private dummyControl: FormControl | undefined;
  
    constructor(
      @Optional() @Self() public ngControl: NgControl,
      protected cdr: ChangeDetectorRef,
    ) {
      // Replace the provider from above with this.
      if (this.ngControl != null) {
        // Setting the value accessor directly (instead of using
        // the providers) to avoid running into a circular import.
        this.ngControl.valueAccessor = this;
      } else {
        // dummy control to avoid errors
        console.warn(
          'No ngControl was passed to component. Using dummy formControl.',
          this,
        );
        this.dummyControl = new FormControl('');
      }
    }
  
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
    }
  
    /**
     * ongOnDestroy method of class (unsubscribe here)
     */
    ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
  
    /**
     * Enables the SyncForm to hold the valueAccessor synchronized to syncForm (value and valid status)
     */
    enableSyncForm(
      formOrFormBuilder: F | ((data: T) => F),
      mapToForm?: ((data: T) => FT) | undefined,
      mapFromForm?: ((data: FT) => T) | undefined,
    ) {
      this.mapToForm = mapToForm;
      this.mapFromForm = mapFromForm;
  
      if (typeof formOrFormBuilder === 'function') {
        this.syncFormBuilder = formOrFormBuilder;
      } else {
        this.syncForm = formOrFormBuilder;
      }
    }
  
    /**
     * Updates the SyncForm
     */
    public updateSyncForm(): void {
      // only if syncForm is enabled
      if (this.syncForm || this.syncFormBuilder) {
        // delete existing syncForm subscriptions
        if (this.syncFormValueSubscription || this.syncFormStatusSubscription) {
          this.syncFormValueSubscription?.unsubscribe();
          this.syncFormStatusSubscription?.unsubscribe();
        }
  
        // update syncForm
        if (this.syncFormBuilder && this.value) {
          // dynamic syncForm needs to be built depending on value
          this.syncForm = this.syncFormBuilder(this.value);
        } else if (this.syncForm) {
          // static syncForm just to be patched with new value
          if (this.value) {
            this.syncForm.patchValue(
              this.mapToForm ? this.mapToForm(this.value) : this.value,
            );
          }
        }
  
        // create syncForm subscriptions for linkage
        this.syncFormValueSubscription = this.syncForm?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((value) => {
            // optional mapping
            value = this.mapFromForm ? this.mapFromForm(value) : value;
  
            this.value = value;
            this.onChange(value);
          });
        this.syncFormStatusSubscription = this.syncForm?.statusChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((status) => {
            if (this.control) {
              this.control.setErrors(
                this.syncForm?.valid ? null : { subFormInvalid: true },
              );
            }
          });
      }
    }
  
    /**
     * writes value entered from outside into form-control
     *
     * @param value value to be written
     */
    public writeValue(value: T): void {
      this.value = value;
  
      // SYNC-FORM UPDATE
      this.updateSyncForm();
  
      // make sure the components are updated
      this.cdr.markForCheck();
    }
  
    /**
     * Allows Angular to register a function to call when the model changes.
     * Save the function as a property to call later here.
     *
     * @param fn callback function
     */
    public registerOnChange(fn: any): void {
      this.onChange = fn;
    }
  
    /**
     * Allows Angular to register a function to call when the input has been touched.
     * Save the function as a property to call later here.
     */
    public registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }
  
    /**
     * set disabled state implemented as part of ControlValueAccessor.
     *
     * @param isDisabled
     */
    public setDisabledState(isDisabled: boolean): void {
      this.disabled = isDisabled;
      this.cdr.markForCheck();
    }
  
    /**
     * Call when value has changed programatically
     */
    protected onChange: any = (_: any) => {};
    /**
     * called when control has been touched
     */
    protected onTouched: any = () => {};
  }
  