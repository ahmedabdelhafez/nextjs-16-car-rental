export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      vehicle: {
        Row: {
          vehicle_id: string;
          make: string;
          model: string;
          year: number;
          vin: string;
          license_plate: string;
          vehicle_type: "Rental" | "Sales" | "Both";
          status: "Available" | "Rented" | "Sold" | "Maintenance" | "Reserved";
          purchase_price: number | null;
          daily_rental_rate: number | null;
          current_mileage: number | null;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          vehicle_id?: string;
          make: string;
          model: string;
          year: number;
          vin: string;
          license_plate: string;
          vehicle_type: "Rental" | "Sales" | "Both";
          status?: "Available" | "Rented" | "Sold" | "Maintenance" | "Reserved";
          purchase_price?: number | null;
          daily_rental_rate?: number | null;
          current_mileage?: number;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          vehicle_id?: string;
          make?: string;
          model?: string;
          year?: number;
          vin?: string;
          license_plate?: string;
          vehicle_type?: "Rental" | "Sales" | "Both";
          status?: "Available" | "Rented" | "Sold" | "Maintenance" | "Reserved";
          purchase_price?: number | null;
          daily_rental_rate?: number | null;
          current_mileage?: number;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer: {
        Row: {
          customer_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          address: string | null;
          date_of_birth: string | null;
          license_number: string | null;
          license_expiry: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          date_of_birth?: string | null;
          license_number?: string | null;
          license_expiry?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          customer_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          date_of_birth?: string | null;
          license_number?: string | null;
          license_expiry?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      partsale: {
        Row: {
          [key: string]: Json;
        };
        Insert: {
          [key: string]: Json;
        };
        Update: {
          [key: string]: Json;
        };
      };
      // Add other tables as needed for type safety
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      vehicle_type: "Rental" | "Sales" | "Both";
      vehicle_status:
        | "Available"
        | "Rented"
        | "Sold"
        | "Maintenance"
        | "Reserved";
    };
  };
};
