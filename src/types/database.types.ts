export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      active_slots: {
        Row: {
          created_at: string | null
          current_occupancy: number | null
          end_time: string
          id: string
          max_capacity: number
          slot_date: string
          start_time: string
          status: Database["public"]["Enums"]["slot_status_enum"]
          template_id: string | null
          terminal_id: string
        }
        Insert: {
          created_at?: string | null
          current_occupancy?: number | null
          end_time: string
          id?: string
          max_capacity: number
          slot_date: string
          start_time: string
          status?: Database["public"]["Enums"]["slot_status_enum"]
          template_id?: string | null
          terminal_id: string
        }
        Update: {
          created_at?: string | null
          current_occupancy?: number | null
          end_time?: string
          id?: string
          max_capacity?: number
          slot_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["slot_status_enum"]
          template_id?: string | null
          terminal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "active_slots_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "slot_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "active_slots_terminal_id_fkey"
            columns: ["terminal_id"]
            isOneToOne: false
            referencedRelation: "terminals"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          agent_key: string
          agent_name: string
          agent_type: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
        }
        Insert: {
          agent_key: string
          agent_name: string
          agent_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
        }
        Update: {
          agent_key?: string
          agent_name?: string
          agent_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      ai_conversation_logs: {
        Row: {
          agent_id: string | null
          agent_type: string | null
          ai_model: string | null
          ai_response: string
          booking_id: string | null
          completion_tokens: number | null
          created_at: string | null
          entities_extracted: Json | null
          id: string
          intent_confidence: number | null
          intent_detected: string | null
          prompt_tokens: number | null
          response_time_ms: number | null
          session_id: string
          user_id: string | null
          user_language: string | null
          user_message: string
          was_helpful: boolean | null
        }
        Insert: {
          agent_id?: string | null
          agent_type?: string | null
          ai_model?: string | null
          ai_response: string
          booking_id?: string | null
          completion_tokens?: number | null
          created_at?: string | null
          entities_extracted?: Json | null
          id?: string
          intent_confidence?: number | null
          intent_detected?: string | null
          prompt_tokens?: number | null
          response_time_ms?: number | null
          session_id: string
          user_id?: string | null
          user_language?: string | null
          user_message: string
          was_helpful?: boolean | null
        }
        Update: {
          agent_id?: string | null
          agent_type?: string | null
          ai_model?: string | null
          ai_response?: string
          booking_id?: string | null
          completion_tokens?: number | null
          created_at?: string | null
          entities_extracted?: Json | null
          id?: string
          intent_confidence?: number | null
          intent_detected?: string | null
          prompt_tokens?: number | null
          response_time_ms?: number | null
          session_id?: string
          user_id?: string | null
          user_language?: string | null
          user_message?: string
          was_helpful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversation_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversation_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_conversation_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      api_clients: {
        Row: {
          allowed_ips: string[] | null
          client_key: string
          client_name: string
          client_secret_hash: string
          created_at: string | null
          id: string
          is_active: boolean | null
          scopes: string[] | null
        }
        Insert: {
          allowed_ips?: string[] | null
          client_key: string
          client_name: string
          client_secret_hash: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          scopes?: string[] | null
        }
        Update: {
          allowed_ips?: string[] | null
          client_key?: string
          client_name?: string
          client_secret_hash?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          scopes?: string[] | null
        }
        Relationships: []
      }
      booking_audit_logs: {
        Row: {
          action_source: Database["public"]["Enums"]["action_source_enum"]
          action_type: Database["public"]["Enums"]["booking_log_action_enum"]
          actor_user_id: string | null
          ai_confidence: number | null
          booking_id: string
          change_reason: string | null
          field_changed: string | null
          id: string
          is_made_by_ai: boolean | null
          new_value: string | null
          old_value: string | null
          timestamp: string | null
        }
        Insert: {
          action_source?: Database["public"]["Enums"]["action_source_enum"]
          action_type: Database["public"]["Enums"]["booking_log_action_enum"]
          actor_user_id?: string | null
          ai_confidence?: number | null
          booking_id: string
          change_reason?: string | null
          field_changed?: string | null
          id?: string
          is_made_by_ai?: boolean | null
          new_value?: string | null
          old_value?: string | null
          timestamp?: string | null
        }
        Update: {
          action_source?: Database["public"]["Enums"]["action_source_enum"]
          action_type?: Database["public"]["Enums"]["booking_log_action_enum"]
          actor_user_id?: string | null
          ai_confidence?: number | null
          booking_id?: string
          change_reason?: string | null
          field_changed?: string | null
          id?: string
          is_made_by_ai?: boolean | null
          new_value?: string | null
          old_value?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_audit_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          base_fee: number | null
          booked_at: string | null
          booking_reference: string
          booking_type: Database["public"]["Enums"]["booking_type_enum"]
          carrier_org_id: string
          check_in_time: string | null
          completed_at: string | null
          confirmed_at: string | null
          created_at: string | null
          discount_amount: number | null
          discount_percentage: number | null
          driver_id: string
          gate_entry_time: string | null
          gate_exit_time: string | null
          id: string
          late_penalties: number | null
          loaded_container_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status_enum"]
          priority: Database["public"]["Enums"]["booking_priority_enum"]
          qr_code: string
          scheduled_date: string
          scheduled_end: string
          scheduled_start: string
          slot_id: string
          status: Database["public"]["Enums"]["booking_status_enum"]
          total_amount: number | null
          truck_id: string
          unloaded_container_id: string | null
          updated_at: string | null
        }
        Insert: {
          base_fee?: number | null
          booked_at?: string | null
          booking_reference: string
          booking_type: Database["public"]["Enums"]["booking_type_enum"]
          carrier_org_id: string
          check_in_time?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          driver_id: string
          gate_entry_time?: string | null
          gate_exit_time?: string | null
          id?: string
          late_penalties?: number | null
          loaded_container_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status_enum"]
          priority?: Database["public"]["Enums"]["booking_priority_enum"]
          qr_code: string
          scheduled_date: string
          scheduled_end: string
          scheduled_start: string
          slot_id: string
          status?: Database["public"]["Enums"]["booking_status_enum"]
          total_amount?: number | null
          truck_id: string
          unloaded_container_id?: string | null
          updated_at?: string | null
        }
        Update: {
          base_fee?: number | null
          booked_at?: string | null
          booking_reference?: string
          booking_type?: Database["public"]["Enums"]["booking_type_enum"]
          carrier_org_id?: string
          check_in_time?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          driver_id?: string
          gate_entry_time?: string | null
          gate_exit_time?: string | null
          id?: string
          late_penalties?: number | null
          loaded_container_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status_enum"]
          priority?: Database["public"]["Enums"]["booking_priority_enum"]
          qr_code?: string
          scheduled_date?: string
          scheduled_end?: string
          scheduled_start?: string
          slot_id?: string
          status?: Database["public"]["Enums"]["booking_status_enum"]
          total_amount?: number | null
          truck_id?: string
          unloaded_container_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_carrier_org_id_fkey"
            columns: ["carrier_org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_loaded_container_id_fkey"
            columns: ["loaded_container_id"]
            isOneToOne: false
            referencedRelation: "containers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "active_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "trucks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_unloaded_container_id_fkey"
            columns: ["unloaded_container_id"]
            isOneToOne: false
            referencedRelation: "containers"
            referencedColumns: ["id"]
          },
        ]
      }
      containers: {
        Row: {
          cargo_weight: number | null
          container_number: string
          container_type: string
          created_at: string | null
          current_status: Database["public"]["Enums"]["container_status_enum"]
          current_terminal_id: string | null
          id: string
          is_empty: boolean
          tare_weight: number | null
        }
        Insert: {
          cargo_weight?: number | null
          container_number: string
          container_type: string
          created_at?: string | null
          current_status?: Database["public"]["Enums"]["container_status_enum"]
          current_terminal_id?: string | null
          id?: string
          is_empty: boolean
          tare_weight?: number | null
        }
        Update: {
          cargo_weight?: number | null
          container_number?: string
          container_type?: string
          created_at?: string | null
          current_status?: Database["public"]["Enums"]["container_status_enum"]
          current_terminal_id?: string | null
          id?: string
          is_empty?: boolean
          tare_weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "containers_current_terminal_id_fkey"
            columns: ["current_terminal_id"]
            isOneToOne: false
            referencedRelation: "terminals"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          license_expiry: string
          license_number: string
          org_id: string
          phone_number: string
          status: Database["public"]["Enums"]["driver_status_enum"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          license_expiry: string
          license_number: string
          org_id: string
          phone_number: string
          status?: Database["public"]["Enums"]["driver_status_enum"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          license_expiry?: string
          license_number?: string
          org_id?: string
          phone_number?: string
          status?: Database["public"]["Enums"]["driver_status_enum"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_lanes: {
        Row: {
          created_at: string | null
          current_queue: number | null
          gate_id: string
          id: string
          is_operational: boolean | null
          lane_name: string | null
          lane_number: number
          lane_type: Database["public"]["Enums"]["lane_type_enum"]
          max_capacity: number | null
        }
        Insert: {
          created_at?: string | null
          current_queue?: number | null
          gate_id: string
          id?: string
          is_operational?: boolean | null
          lane_name?: string | null
          lane_number: number
          lane_type?: Database["public"]["Enums"]["lane_type_enum"]
          max_capacity?: number | null
        }
        Update: {
          created_at?: string | null
          current_queue?: number | null
          gate_id?: string
          id?: string
          is_operational?: boolean | null
          lane_name?: string | null
          lane_number?: number
          lane_type?: Database["public"]["Enums"]["lane_type_enum"]
          max_capacity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gate_lanes_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "gates"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_logs: {
        Row: {
          action_type: Database["public"]["Enums"]["gate_action_type_enum"]
          booking_id: string
          detected_plate: string | null
          gate_id: string
          gate_lane_id: string | null
          id: string
          measured_weight: number | null
          operator_user_id: string | null
          overweight: boolean | null
          plate_match: boolean | null
          status: Database["public"]["Enums"]["operation_status_enum"]
          status_message: string | null
          timestamp: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["gate_action_type_enum"]
          booking_id: string
          detected_plate?: string | null
          gate_id: string
          gate_lane_id?: string | null
          id?: string
          measured_weight?: number | null
          operator_user_id?: string | null
          overweight?: boolean | null
          plate_match?: boolean | null
          status?: Database["public"]["Enums"]["operation_status_enum"]
          status_message?: string | null
          timestamp?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["gate_action_type_enum"]
          booking_id?: string
          detected_plate?: string | null
          gate_id?: string
          gate_lane_id?: string | null
          id?: string
          measured_weight?: number | null
          operator_user_id?: string | null
          overweight?: boolean | null
          plate_match?: boolean | null
          status?: Database["public"]["Enums"]["operation_status_enum"]
          status_message?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gate_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_logs_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "gates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_logs_gate_lane_id_fkey"
            columns: ["gate_lane_id"]
            isOneToOne: false
            referencedRelation: "gate_lanes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_logs_operator_user_id_fkey"
            columns: ["operator_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      gates: {
        Row: {
          created_at: string | null
          gate_number: string
          gate_status: Database["public"]["Enums"]["gate_status_enum"]
          id: string
          physical_capacity: number | null
          port_id: string
        }
        Insert: {
          created_at?: string | null
          gate_number: string
          gate_status?: Database["public"]["Enums"]["gate_status_enum"]
          id?: string
          physical_capacity?: number | null
          port_id: string
        }
        Update: {
          created_at?: string | null
          gate_number?: string
          gate_status?: Database["public"]["Enums"]["gate_status_enum"]
          id?: string
          physical_capacity?: number | null
          port_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gates_port_id_fkey"
            columns: ["port_id"]
            isOneToOne: false
            referencedRelation: "ports"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          delivery_channel: Database["public"]["Enums"]["delivery_channel_enum"]
          delivery_status: Database["public"]["Enums"]["delivery_status_enum"]
          id: string
          is_read: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type_enum"]
          read_at: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          scheduled_for: string | null
          sent_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_channel?: Database["public"]["Enums"]["delivery_channel_enum"]
          delivery_status?: Database["public"]["Enums"]["delivery_status_enum"]
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type_enum"]
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivery_channel?: Database["public"]["Enums"]["delivery_channel_enum"]
          delivery_status?: Database["public"]["Enums"]["delivery_status_enum"]
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: Database["public"]["Enums"]["notification_type_enum"]
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          nif: string
          type: Database["public"]["Enums"]["organisation_type_enum"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          nif: string
          type: Database["public"]["Enums"]["organisation_type_enum"]
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          nif?: string
          type?: Database["public"]["Enums"]["organisation_type_enum"]
        }
        Relationships: []
      }
      ports: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          plan_image_url: string | null
          wilaya: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          plan_image_url?: string | null
          wilaya?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          plan_image_url?: string | null
          wilaya?: string | null
        }
        Relationships: []
      }
      qr_tokens: {
        Row: {
          booking_id: string
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used: boolean | null
          used_at: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used?: boolean | null
          used_at?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used?: boolean | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_tokens_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      slot_overrides: {
        Row: {
          created_at: string | null
          days_of_week: number[] | null
          end_date: string
          id: string
          is_active: boolean | null
          new_max_capacity: number | null
          override_type: Database["public"]["Enums"]["slot_override_type_enum"]
          reason: string | null
          start_date: string
          terminal_id: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: number[] | null
          end_date: string
          id?: string
          is_active?: boolean | null
          new_max_capacity?: number | null
          override_type: Database["public"]["Enums"]["slot_override_type_enum"]
          reason?: string | null
          start_date: string
          terminal_id: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: number[] | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          new_max_capacity?: number | null
          override_type?: Database["public"]["Enums"]["slot_override_type_enum"]
          reason?: string | null
          start_date?: string
          terminal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "slot_overrides_terminal_id_fkey"
            columns: ["terminal_id"]
            isOneToOne: false
            referencedRelation: "terminals"
            referencedColumns: ["id"]
          },
        ]
      }
      slot_templates: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          max_capacity: number
          start_time: string
          terminal_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          max_capacity: number
          start_time: string
          terminal_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          max_capacity?: number
          start_time?: string
          terminal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "slot_templates_terminal_id_fkey"
            columns: ["terminal_id"]
            isOneToOne: false
            referencedRelation: "terminals"
            referencedColumns: ["id"]
          },
        ]
      }
      terminals: {
        Row: {
          created_at: string | null
          current_occupancy: number | null
          gate_id: string | null
          id: string
          modified_at: string | null
          port_id: string
          total_capacity: number
          zone_code: string
          zone_name: string
        }
        Insert: {
          created_at?: string | null
          current_occupancy?: number | null
          gate_id?: string | null
          id?: string
          modified_at?: string | null
          port_id: string
          total_capacity: number
          zone_code: string
          zone_name: string
        }
        Update: {
          created_at?: string | null
          current_occupancy?: number | null
          gate_id?: string | null
          id?: string
          modified_at?: string | null
          port_id?: string
          total_capacity?: number
          zone_code?: string
          zone_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "terminals_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "gates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terminals_port_id_fkey"
            columns: ["port_id"]
            isOneToOne: false
            referencedRelation: "ports"
            referencedColumns: ["id"]
          },
        ]
      }
      trucks: {
        Row: {
          created_at: string | null
          id: string
          max_capacity: number | null
          org_id: string
          plate_number: string
          status: Database["public"]["Enums"]["truck_status_enum"]
          tare_weight: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_capacity?: number | null
          org_id: string
          plate_number: string
          status?: Database["public"]["Enums"]["truck_status_enum"]
          tare_weight?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_capacity?: number | null
          org_id?: string
          plate_number?: string
          status?: Database["public"]["Enums"]["truck_status_enum"]
          tare_weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trucks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          org_id: string
          role: Database["public"]["Enums"]["user_role_enum"]
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          org_id: string
          role: Database["public"]["Enums"]["user_role_enum"]
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          org_id?: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      websocket_sessions: {
        Row: {
          connected_at: string | null
          id: string
          is_active: boolean | null
          last_ping: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          last_ping?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          connected_at?: string | null
          id?: string
          is_active?: boolean | null
          last_ping?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "websocket_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_active_slots: { Args: { target_date?: string }; Returns: number }
    }
    Enums: {
      action_source_enum: "WEB" | "MOBILE" | "WHATSAPP" | "API"
      booking_log_action_enum:
        | "CREATED"
        | "UPDATED"
        | "CONFIRMED"
        | "CANCELLED"
        | "STATUS_CHANGED"
      booking_priority_enum: "LOW" | "NORMAL" | "HIGH" | "URGENT"
      booking_status_enum:
        | "PENDING"
        | "CONFIRMED"
        | "CHECKED_IN"
        | "AT_GATE"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
        | "NO_SHOW"
      booking_type_enum:
        | "IMPORT_PICKUP"
        | "EXPORT_DELIVERY"
        | "EMPTY_PICKUP"
        | "EMPTY_RETURN"
      container_status_enum:
        | "AVAILABLE"
        | "BOOKED"
        | "IN_TRANSIT"
        | "AT_GATE"
        | "IN_YARD"
        | "ON_VESSEL"
        | "RETURNED"
        | "WITH_CLIENT"
      delivery_channel_enum: "EMAIL" | "SMS" | "WHATSAPP" | "PUSH" | "IN_APP"
      delivery_status_enum: "PENDING" | "SENT" | "DELIVERED" | "FAILED"
      driver_status_enum: "ACTIVE" | "INACTIVE" | "SUSPENDED"
      gate_action_type_enum:
        | "CHECK_IN"
        | "ENTRY"
        | "WEIGHMENT"
        | "INSPECTION"
        | "EXIT"
        | "REJECTED"
      gate_status_enum: "OPERATIONAL" | "CLOSED" | "MAINTENANCE"
      lane_type_enum: "ENTRY" | "EXIT" | "BIDIRECTIONAL"
      notification_type_enum:
        | "BOOKING_CONFIRMED"
        | "SLOT_REMINDER"
        | "GATE_READY"
        | "PAYMENT_DUE"
        | "SYSTEM_ALERT"
      operation_status_enum: "SUCCESS" | "FAILED" | "WARNING"
      organisation_type_enum: "ADMIN" | "TERMINAL_OPERATOR" | "CARRIER"
      payment_status_enum: "UNPAID" | "PAID" | "WAIVED"
      slot_override_type_enum: "CLOSE" | "CAPACITY_CHANGE" | "HOURS_CHANGE"
      slot_status_enum: "AVAILABLE" | "FULL" | "CLOSED"
      truck_status_enum: "AVAILABLE" | "IN_USE" | "MAINTENANCE"
      user_role_enum: "ADMIN" | "OPERATOR" | "DISPATCHER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      action_source_enum: ["WEB", "MOBILE", "WHATSAPP", "API"],
      booking_log_action_enum: [
        "CREATED",
        "UPDATED",
        "CONFIRMED",
        "CANCELLED",
        "STATUS_CHANGED",
      ],
      booking_priority_enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
      booking_status_enum: [
        "PENDING",
        "CONFIRMED",
        "CHECKED_IN",
        "AT_GATE",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ],
      booking_type_enum: [
        "IMPORT_PICKUP",
        "EXPORT_DELIVERY",
        "EMPTY_PICKUP",
        "EMPTY_RETURN",
      ],
      container_status_enum: [
        "AVAILABLE",
        "BOOKED",
        "IN_TRANSIT",
        "AT_GATE",
        "IN_YARD",
        "ON_VESSEL",
        "RETURNED",
        "WITH_CLIENT",
      ],
      delivery_channel_enum: ["EMAIL", "SMS", "WHATSAPP", "PUSH", "IN_APP"],
      delivery_status_enum: ["PENDING", "SENT", "DELIVERED", "FAILED"],
      driver_status_enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      gate_action_type_enum: [
        "CHECK_IN",
        "ENTRY",
        "WEIGHMENT",
        "INSPECTION",
        "EXIT",
        "REJECTED",
      ],
      gate_status_enum: ["OPERATIONAL", "CLOSED", "MAINTENANCE"],
      lane_type_enum: ["ENTRY", "EXIT", "BIDIRECTIONAL"],
      notification_type_enum: [
        "BOOKING_CONFIRMED",
        "SLOT_REMINDER",
        "GATE_READY",
        "PAYMENT_DUE",
        "SYSTEM_ALERT",
      ],
      operation_status_enum: ["SUCCESS", "FAILED", "WARNING"],
      organisation_type_enum: ["ADMIN", "TERMINAL_OPERATOR", "CARRIER"],
      payment_status_enum: ["UNPAID", "PAID", "WAIVED"],
      slot_override_type_enum: ["CLOSE", "CAPACITY_CHANGE", "HOURS_CHANGE"],
      slot_status_enum: ["AVAILABLE", "FULL", "CLOSED"],
      truck_status_enum: ["AVAILABLE", "IN_USE", "MAINTENANCE"],
      user_role_enum: ["ADMIN", "OPERATOR", "DISPATCHER"],
    },
  },
} as const

