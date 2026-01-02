-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM Types
CREATE TYPE vehicle_type AS ENUM ('Rental', 'Sales', 'Both');
CREATE TYPE vehicle_status AS ENUM ('Available', 'Rented', 'Sold', 'Maintenance', 'Reserved');
CREATE TYPE verification_type AS ENUM ('BankAccount', 'TrafficLicense', 'Identity');
CREATE TYPE verification_status AS ENUM ('Pending', 'Approved', 'Rejected', 'Expired');
CREATE TYPE transaction_type AS ENUM ('Rental', 'Purchase', 'Trade-in');
CREATE TYPE transaction_status AS ENUM ('Pending', 'Completed', 'Cancelled', 'Refunded');
CREATE TYPE payment_method AS ENUM ('CreditCard', 'BankTransfer', 'Cash', 'Installment');
CREATE TYPE plan_status AS ENUM ('Active', 'Completed', 'Defaulted', 'Cancelled');
CREATE TYPE payment_status AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');
CREATE TYPE agreement_status AS ENUM ('Active', 'Completed', 'Terminated', 'Overdue');
CREATE TYPE bay_type AS ENUM ('Standard', 'Diagnostic', 'OilChange', 'Tire', 'Electric');
CREATE TYPE bay_status AS ENUM ('Available', 'Occupied', 'Maintenance', 'Reserved');
CREATE TYPE appointment_status AS ENUM ('Scheduled', 'InProgress', 'Completed', 'Cancelled', 'NoShow');
CREATE TYPE order_status AS ENUM ('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled');
CREATE TYPE sale_status AS ENUM ('Pending', 'Completed', 'Cancelled', 'Refunded');

-- TABLE: Customer
CREATE TABLE Customer (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    date_of_birth DATE,
    license_number VARCHAR(100),
    license_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- TABLE: Verification
CREATE TABLE Verification (
    verification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    verification_type verification_type NOT NULL,
    verification_status verification_status DEFAULT 'Pending',
    verification_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    reference_number VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: Bank
CREATE TABLE Bank (
    bank_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bank_name VARCHAR(255) NOT NULL,
    branch_code VARCHAR(50),
    contact_info TEXT,
    api_endpoint VARCHAR(255),
    api_key VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: BankAccount
CREATE TABLE BankAccount (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    bank_id UUID REFERENCES Bank(bank_id) ON DELETE SET NULL,
    account_number VARCHAR(100) NOT NULL,
    account_type VARCHAR(50),
    account_status VARCHAR(50) DEFAULT 'Active',
    verification_id UUID REFERENCES Verification(verification_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: TrafficRecord
CREATE TABLE TrafficRecord (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    license_number VARCHAR(100) NOT NULL,
    violation_status VARCHAR(50),
    violation_details TEXT,
    verification_id UUID REFERENCES Verification(verification_id) ON DELETE SET NULL,
    last_checked_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: Vehicle
CREATE TABLE Vehicle (
    vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    vin VARCHAR(100) UNIQUE NOT NULL,
    license_plate VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    status vehicle_status DEFAULT 'Available',
    purchase_price DECIMAL(12, 2),
    daily_rental_rate DECIMAL(10, 2),
    current_mileage INTEGER DEFAULT 0,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: Employee
CREATE TABLE Employee (
    employee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    position VARCHAR(100),
    department VARCHAR(100),
    hire_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: Transaction
CREATE TABLE Transaction (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES Vehicle(vehicle_id) ON DELETE SET NULL,
    employee_id UUID REFERENCES Employee(employee_id) ON DELETE SET NULL,
    transaction_type transaction_type NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    amount DECIMAL(12, 2) NOT NULL,
    payment_method payment_method,
    transaction_status transaction_status DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: InstallmentPlan
CREATE TABLE InstallmentPlan (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES Transaction(transaction_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    bank_id UUID REFERENCES Bank(bank_id) ON DELETE SET NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    down_payment DECIMAL(12, 2) DEFAULT 0,
    interest_rate DECIMAL(5, 2) DEFAULT 0,
    term_months INTEGER NOT NULL,
    monthly_payment DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    plan_status plan_status DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: RentalAgreement
CREATE TABLE RentalAgreement (
    agreement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES Transaction(transaction_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES Vehicle(vehicle_id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expected_return_date TIMESTAMP WITH TIME ZONE,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    daily_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    deposit_amount DECIMAL(12, 2) DEFAULT 0,
    agreement_status agreement_status DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: Payment
CREATE TABLE Payment (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES InstallmentPlan(plan_id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES Transaction(transaction_id) ON DELETE SET NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    amount DECIMAL(12, 2) NOT NULL,
    payment_status payment_status DEFAULT 'Pending',
    payment_method payment_method,
    transaction_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: ServiceCenter
CREATE TABLE ServiceCenter (
    center_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location TEXT,
    contact_info TEXT,
    operating_hours VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: ServiceBay
CREATE TABLE ServiceBay (
    bay_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID REFERENCES ServiceCenter(center_id) ON DELETE CASCADE,
    bay_number VARCHAR(50) NOT NULL,
    bay_type bay_type DEFAULT 'Standard',
    status bay_status DEFAULT 'Available',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: ServiceType
CREATE TABLE ServiceType (
    type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INTERVAL,
    base_price DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: ServiceAppointment
CREATE TABLE ServiceAppointment (
    appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES Vehicle(vehicle_id) ON DELETE SET NULL,
    center_id UUID REFERENCES ServiceCenter(center_id) ON DELETE SET NULL,
    bay_id UUID REFERENCES ServiceBay(bay_id) ON DELETE SET NULL,
    service_type_id UUID REFERENCES ServiceType(type_id) ON DELETE SET NULL,
    employee_id UUID REFERENCES Employee(employee_id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status appointment_status DEFAULT 'Scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: ServiceRecord
CREATE TABLE ServiceRecord (
    record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES ServiceAppointment(appointment_id) ON DELETE SET NULL,
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES Vehicle(vehicle_id) ON DELETE SET NULL,
    service_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    odometer_reading INTEGER,
    service_details TEXT,
    labor_cost DECIMAL(10, 2) DEFAULT 0,
    parts_cost DECIMAL(10, 2) DEFAULT 0,
    total_cost DECIMAL(12, 2) DEFAULT 0,
    warranty_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: Supplier
CREATE TABLE Supplier (
    supplier_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_info TEXT,
    address TEXT,
    payment_terms TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: Part
CREATE TABLE Part (
    part_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_number VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit_price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 5,
    supplier_id UUID REFERENCES Supplier(supplier_id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: PartOrder
CREATE TABLE PartOrder (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES Supplier(supplier_id) ON DELETE SET NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_delivery_date TIMESTAMP WITH TIME ZONE,
    status order_status DEFAULT 'Pending',
    total_amount DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: PartOrderItem
CREATE TABLE PartOrderItem (
    order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES PartOrder(order_id) ON DELETE CASCADE,
    part_id UUID REFERENCES Part(part_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: PartSale
CREATE TABLE PartSale (
    sale_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE SET NULL,
    employee_id UUID REFERENCES Employee(employee_id) ON DELETE SET NULL,
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_amount DECIMAL(12, 2) DEFAULT 0,
    payment_method payment_method,
    sale_status sale_status DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: PartSaleItem
CREATE TABLE PartSaleItem (
    sale_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES PartSale(sale_id) ON DELETE CASCADE,
    part_id UUID REFERENCES Part(part_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: ServicePart
CREATE TABLE ServicePart (
    service_part_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id UUID REFERENCES ServiceRecord(record_id) ON DELETE CASCADE,
    part_id UUID REFERENCES Part(part_id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_customer_modtime BEFORE UPDATE ON Customer FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_bankaccount_modtime BEFORE UPDATE ON BankAccount FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_vehicle_modtime BEFORE UPDATE ON Vehicle FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_transaction_modtime BEFORE UPDATE ON Transaction FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_installmentplan_modtime BEFORE UPDATE ON InstallmentPlan FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_rentalagreement_modtime BEFORE UPDATE ON RentalAgreement FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_servicecenter_modtime BEFORE UPDATE ON ServiceCenter FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_servicebay_modtime BEFORE UPDATE ON ServiceBay FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_serviceappointment_modtime BEFORE UPDATE ON ServiceAppointment FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_part_modtime BEFORE UPDATE ON Part FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_partorder_modtime BEFORE UPDATE ON PartOrder FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_partsale_modtime BEFORE UPDATE ON PartSale FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_verification_modtime BEFORE UPDATE ON Verification FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_payment_modtime BEFORE UPDATE ON Payment FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
