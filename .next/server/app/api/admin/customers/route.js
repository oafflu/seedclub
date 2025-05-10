/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/admin/customers/route";
exports.ids = ["app/api/admin/customers/route"];
exports.modules = {

/***/ "(rsc)/./app/api/admin/customers/route.ts":
/*!******************************************!*\
  !*** ./app/api/admin/customers/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase/admin */ \"(rsc)/./lib/supabase/admin.ts\");\n\n\nasync function GET(request) {\n    try {\n        // Select all relevant fields\n        let { data: customers, error } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customers\").select(\"id, email, first_name, last_name, is_active, customer_profiles(address_line1, address_line2, city, state, zip_code, country, date_of_birth, tax_id, occupation, employer_name, annual_income, source_of_funds, notes, receive_marketing_emails), kyc_verifications(status)\").order(\"created_at\", {\n            ascending: false\n        });\n        if (error) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: error.message || \"Failed to fetch customers\"\n            }, {\n                status: 500\n            });\n        }\n        // Map kyc_status for each customer\n        const mapped = (customers || []).map((c)=>({\n                id: c.id,\n                email: c.email,\n                first_name: c.first_name,\n                last_name: c.last_name,\n                is_active: c.is_active,\n                ...c.customer_profiles,\n                kyc_status: c.kyc_verifications?.[0]?.status || \"pending\"\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(mapped);\n    } catch (error) {\n        console.error(\"Error fetching customers:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to fetch customers\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const data = await request.json();\n        // Generate next customer code\n        const { data: maxCodeRow } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customers\").select(\"code\").order(\"created_at\", {\n            ascending: false\n        }).limit(1).single();\n        let nextNumber = 1;\n        if (maxCodeRow && maxCodeRow.code) {\n            const match = maxCodeRow.code.match(/CUST-(\\d+)/);\n            if (match) nextNumber = parseInt(match[1], 10) + 1;\n        }\n        const newCode = `CUST-${nextNumber.toString().padStart(3, '0')}`;\n        // Create customer\n        const { data: customer, error: customerError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customers\").insert({\n            code: newCode,\n            first_name: data.firstName,\n            last_name: data.lastName,\n            email: data.email,\n            phone: data.phone,\n            is_active: data.status === \"active\"\n        }).select().single();\n        if (customerError) throw customerError;\n        // Create customer profile\n        const { error: profileError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customer_profiles\").insert({\n            customer_id: customer.id,\n            address_line1: data.addressLine1,\n            address_line2: data.addressLine2,\n            city: data.city,\n            state: data.state,\n            zip_code: data.zipCode,\n            country: data.country,\n            date_of_birth: data.dateOfBirth,\n            tax_id: data.taxId,\n            occupation: data.occupation,\n            employer_name: data.employerName,\n            annual_income: data.annualIncome ? parseFloat(data.annualIncome.toString()) : null,\n            source_of_funds: data.sourceOfFunds,\n            notes: data.notes,\n            receive_marketing_emails: data.receiveMarketingEmails\n        });\n        if (profileError) throw profileError;\n        // Create initial KYC verification record\n        const { error: kycError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"kyc_verifications\").insert({\n            customer_id: customer.id,\n            document_type: \"pending\",\n            status: data.kycStatus || \"pending\"\n        });\n        if (kycError) throw kycError;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(customer, {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"Error creating customer:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to create customer\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function PUT(request) {\n    try {\n        const data = await request.json();\n        const { id, ...updateData } = data;\n        if (!id) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Customer ID is required\"\n            }, {\n                status: 400\n            });\n        }\n        // Update customer\n        const { data: customer, error } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('customers').update(updateData).eq('id', id).select().single();\n        if (error) throw error;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(customer);\n    } catch (error) {\n        console.error(\"Error updating customer:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to update customer\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function DELETE(request) {\n    try {\n        const { searchParams } = new URL(request.url);\n        const id = searchParams.get(\"id\");\n        if (!id) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Customer ID is required\"\n            }, {\n                status: 400\n            });\n        }\n        // Delete customer\n        const { error } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('customers').delete().eq('id', id);\n        if (error) throw error;\n        return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(null, {\n            status: 204\n        });\n    } catch (error) {\n        console.error(\"Error deleting customer:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to delete customer\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL2N1c3RvbWVycy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBdUQ7QUFDSDtBQUU3QyxlQUFlRSxJQUFJQyxPQUFvQjtJQUM1QyxJQUFJO1FBQ0YsNkJBQTZCO1FBQzdCLElBQUksRUFBRUMsTUFBTUMsU0FBUyxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNTCw4REFBYUEsQ0FDakRNLElBQUksQ0FBQyxhQUNMQyxNQUFNLENBQUMsOFFBQ1BDLEtBQUssQ0FBQyxjQUFjO1lBQUVDLFdBQVc7UUFBTTtRQUUxQyxJQUFJSixPQUFPO1lBQ1QsT0FBT04scURBQVlBLENBQUNXLElBQUksQ0FDdEI7Z0JBQUVMLE9BQU9BLE1BQU1NLE9BQU8sSUFBSTtZQUE0QixHQUN0RDtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsbUNBQW1DO1FBQ25DLE1BQU1DLFNBQVMsQ0FBQ1QsYUFBYSxFQUFFLEVBQUVVLEdBQUcsQ0FBQyxDQUFDQyxJQUFZO2dCQUNoREMsSUFBSUQsRUFBRUMsRUFBRTtnQkFDUkMsT0FBT0YsRUFBRUUsS0FBSztnQkFDZEMsWUFBWUgsRUFBRUcsVUFBVTtnQkFDeEJDLFdBQVdKLEVBQUVJLFNBQVM7Z0JBQ3RCQyxXQUFXTCxFQUFFSyxTQUFTO2dCQUN0QixHQUFHTCxFQUFFTSxpQkFBaUI7Z0JBQ3RCQyxZQUFZUCxFQUFFUSxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsRUFBRVgsVUFBVTtZQUNsRDtRQUVBLE9BQU9iLHFEQUFZQSxDQUFDVyxJQUFJLENBQUNHO0lBQzNCLEVBQUUsT0FBT1IsT0FBTztRQUNkbUIsUUFBUW5CLEtBQUssQ0FBQyw2QkFBNkJBO1FBQzNDLE9BQU9OLHFEQUFZQSxDQUFDVyxJQUFJLENBQ3RCO1lBQUVMLE9BQU9BLGlCQUFpQm9CLFFBQVFwQixNQUFNTSxPQUFPLEdBQUc7UUFBNEIsR0FDOUU7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0Y7QUFFTyxlQUFlYyxLQUFLeEIsT0FB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QUFNM0Q7UUFDMUUsSUFBSVgsT0FBTyxNQUFNQTtRQUNqQixPQUFPLElBQUlOLHFEQUFZQSxDQUFDLE1BQU07WUFBRWEsUUFBUTtRQUFJO0lBQzlDLEVBQUUsT0FBT1AsT0FBTztRQUNkbUIsUUFBUW5CLEtBQUssQ0FBQyw0QkFBNEJBO1FBQzFDLE9BQU9OLHFEQUFZQSxDQUFDVyxJQUFJLENBQ3RCO1lBQUVMLE9BQU9BLGlCQUFpQm9CLFFBQVFwQixNQUFNTSxPQUFPLEdBQUc7UUFBNEIsR0FDOUU7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9vYmVka2FmZmx1L0RvY3VtZW50cy9HaXRIdWIvc2VlZGNsdWIvYXBwL2FwaS9hZG1pbi9jdXN0b21lcnMvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlLCBOZXh0UmVxdWVzdCB9IGZyb20gXCJuZXh0L3NlcnZlclwiXG5pbXBvcnQgeyBzdXBhYmFzZUFkbWluIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UvYWRtaW4nXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICAvLyBTZWxlY3QgYWxsIHJlbGV2YW50IGZpZWxkc1xuICAgIGxldCB7IGRhdGE6IGN1c3RvbWVycywgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKFwiY3VzdG9tZXJzXCIpXG4gICAgICAuc2VsZWN0KFwiaWQsIGVtYWlsLCBmaXJzdF9uYW1lLCBsYXN0X25hbWUsIGlzX2FjdGl2ZSwgY3VzdG9tZXJfcHJvZmlsZXMoYWRkcmVzc19saW5lMSwgYWRkcmVzc19saW5lMiwgY2l0eSwgc3RhdGUsIHppcF9jb2RlLCBjb3VudHJ5LCBkYXRlX29mX2JpcnRoLCB0YXhfaWQsIG9jY3VwYXRpb24sIGVtcGxveWVyX25hbWUsIGFubnVhbF9pbmNvbWUsIHNvdXJjZV9vZl9mdW5kcywgbm90ZXMsIHJlY2VpdmVfbWFya2V0aW5nX2VtYWlscyksIGt5Y192ZXJpZmljYXRpb25zKHN0YXR1cylcIilcbiAgICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBmZXRjaCBjdXN0b21lcnNcIiB9LFxuICAgICAgICB7IHN0YXR1czogNTAwIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICAvLyBNYXAga3ljX3N0YXR1cyBmb3IgZWFjaCBjdXN0b21lclxuICAgIGNvbnN0IG1hcHBlZCA9IChjdXN0b21lcnMgfHwgW10pLm1hcCgoYzogYW55KSA9PiAoe1xuICAgICAgaWQ6IGMuaWQsXG4gICAgICBlbWFpbDogYy5lbWFpbCxcbiAgICAgIGZpcnN0X25hbWU6IGMuZmlyc3RfbmFtZSxcbiAgICAgIGxhc3RfbmFtZTogYy5sYXN0X25hbWUsXG4gICAgICBpc19hY3RpdmU6IGMuaXNfYWN0aXZlLFxuICAgICAgLi4uYy5jdXN0b21lcl9wcm9maWxlcyxcbiAgICAgIGt5Y19zdGF0dXM6IGMua3ljX3ZlcmlmaWNhdGlvbnM/LlswXT8uc3RhdHVzIHx8IFwicGVuZGluZ1wiXG4gICAgfSkpXG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24obWFwcGVkKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBjdXN0b21lcnM6XCIsIGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gZmV0Y2ggY3VzdG9tZXJzXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcXVlc3QuanNvbigpXG4gICAgLy8gR2VuZXJhdGUgbmV4dCBjdXN0b21lciBjb2RlXG4gICAgY29uc3QgeyBkYXRhOiBtYXhDb2RlUm93IH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAuZnJvbShcImN1c3RvbWVyc1wiKVxuICAgICAgLnNlbGVjdChcImNvZGVcIilcbiAgICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXG4gICAgICAubGltaXQoMSlcbiAgICAgIC5zaW5nbGUoKTtcbiAgICBsZXQgbmV4dE51bWJlciA9IDE7XG4gICAgaWYgKG1heENvZGVSb3cgJiYgbWF4Q29kZVJvdy5jb2RlKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IG1heENvZGVSb3cuY29kZS5tYXRjaCgvQ1VTVC0oXFxkKykvKTtcbiAgICAgIGlmIChtYXRjaCkgbmV4dE51bWJlciA9IHBhcnNlSW50KG1hdGNoWzFdLCAxMCkgKyAxO1xuICAgIH1cbiAgICBjb25zdCBuZXdDb2RlID0gYENVU1QtJHtuZXh0TnVtYmVyLnRvU3RyaW5nKCkucGFkU3RhcnQoMywgJzAnKX1gO1xuICAgIC8vIENyZWF0ZSBjdXN0b21lclxuICAgIGNvbnN0IHsgZGF0YTogY3VzdG9tZXIsIGVycm9yOiBjdXN0b21lckVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmZyb20oXCJjdXN0b21lcnNcIikuaW5zZXJ0KHtcbiAgICAgIGNvZGU6IG5ld0NvZGUsXG4gICAgICBmaXJzdF9uYW1lOiBkYXRhLmZpcnN0TmFtZSxcbiAgICAgIGxhc3RfbmFtZTogZGF0YS5sYXN0TmFtZSxcbiAgICAgIGVtYWlsOiBkYXRhLmVtYWlsLFxuICAgICAgcGhvbmU6IGRhdGEucGhvbmUsXG4gICAgICBpc19hY3RpdmU6IGRhdGEuc3RhdHVzID09PSBcImFjdGl2ZVwiLFxuICAgIH0pLnNlbGVjdCgpLnNpbmdsZSgpXG4gICAgaWYgKGN1c3RvbWVyRXJyb3IpIHRocm93IGN1c3RvbWVyRXJyb3JcblxuICAgIC8vIENyZWF0ZSBjdXN0b21lciBwcm9maWxlXG4gICAgY29uc3QgeyBlcnJvcjogcHJvZmlsZUVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmZyb20oXCJjdXN0b21lcl9wcm9maWxlc1wiKS5pbnNlcnQoe1xuICAgICAgY3VzdG9tZXJfaWQ6IGN1c3RvbWVyLmlkLFxuICAgICAgYWRkcmVzc19saW5lMTogZGF0YS5hZGRyZXNzTGluZTEsXG4gICAgICBhZGRyZXNzX2xpbmUyOiBkYXRhLmFkZHJlc3NMaW5lMixcbiAgICAgIGNpdHk6IGRhdGEuY2l0eSxcbiAgICAgIHN0YXRlOiBkYXRhLnN0YXRlLFxuICAgICAgemlwX2NvZGU6IGRhdGEuemlwQ29kZSxcbiAgICAgIGNvdW50cnk6IGRhdGEuY291bnRyeSxcbiAgICAgIGRhdGVfb2ZfYmlydGg6IGRhdGEuZGF0ZU9mQmlydGgsXG4gICAgICB0YXhfaWQ6IGRhdGEudGF4SWQsXG4gICAgICBvY2N1cGF0aW9uOiBkYXRhLm9jY3VwYXRpb24sXG4gICAgICBlbXBsb3llcl9uYW1lOiBkYXRhLmVtcGxveWVyTmFtZSxcbiAgICAgIGFubnVhbF9pbmNvbWU6IGRhdGEuYW5udWFsSW5jb21lID8gcGFyc2VGbG9hdChkYXRhLmFubnVhbEluY29tZS50b1N0cmluZygpKSA6IG51bGwsXG4gICAgICBzb3VyY2Vfb2ZfZnVuZHM6IGRhdGEuc291cmNlT2ZGdW5kcyxcbiAgICAgIG5vdGVzOiBkYXRhLm5vdGVzLFxuICAgICAgcmVjZWl2ZV9tYXJrZXRpbmdfZW1haWxzOiBkYXRhLnJlY2VpdmVNYXJrZXRpbmdFbWFpbHMsXG4gICAgfSlcbiAgICBpZiAocHJvZmlsZUVycm9yKSB0aHJvdyBwcm9maWxlRXJyb3JcblxuICAgIC8vIENyZWF0ZSBpbml0aWFsIEtZQyB2ZXJpZmljYXRpb24gcmVjb3JkXG4gICAgY29uc3QgeyBlcnJvcjoga3ljRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW4uZnJvbShcImt5Y192ZXJpZmljYXRpb25zXCIpLmluc2VydCh7XG4gICAgICBjdXN0b21lcl9pZDogY3VzdG9tZXIuaWQsXG4gICAgICBkb2N1bWVudF90eXBlOiBcInBlbmRpbmdcIixcbiAgICAgIHN0YXR1czogZGF0YS5reWNTdGF0dXMgfHwgXCJwZW5kaW5nXCIsXG4gICAgfSlcbiAgICBpZiAoa3ljRXJyb3IpIHRocm93IGt5Y0Vycm9yXG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oY3VzdG9tZXIsIHsgc3RhdHVzOiAyMDEgfSlcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgY3JlYXRpbmcgY3VzdG9tZXI6XCIsIGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gY3JlYXRlIGN1c3RvbWVyXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUFVUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVxdWVzdC5qc29uKClcbiAgICBjb25zdCB7IGlkLCAuLi51cGRhdGVEYXRhIH0gPSBkYXRhXG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiQ3VzdG9tZXIgSUQgaXMgcmVxdWlyZWRcIiB9LCB7IHN0YXR1czogNDAwIH0pXG4gICAgfVxuICAgIC8vIFVwZGF0ZSBjdXN0b21lclxuICAgIGNvbnN0IHsgZGF0YTogY3VzdG9tZXIsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmZyb20oJ2N1c3RvbWVycycpLnVwZGF0ZSh1cGRhdGVEYXRhKS5lcSgnaWQnLCBpZCkuc2VsZWN0KCkuc2luZ2xlKClcbiAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGN1c3RvbWVyKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB1cGRhdGluZyBjdXN0b21lcjpcIiwgZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byB1cGRhdGUgY3VzdG9tZXJcIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBERUxFVEUocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKVxuICAgIGNvbnN0IGlkID0gc2VhcmNoUGFyYW1zLmdldChcImlkXCIpXG4gICAgaWYgKCFpZCkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiQ3VzdG9tZXIgSUQgaXMgcmVxdWlyZWRcIiB9LCB7IHN0YXR1czogNDAwIH0pXG4gICAgfVxuICAgIC8vIERlbGV0ZSBjdXN0b21lclxuICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW4uZnJvbSgnY3VzdG9tZXJzJykuZGVsZXRlKCkuZXEoJ2lkJywgaWQpXG4gICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvclxuICAgIHJldHVybiBuZXcgTmV4dFJlc3BvbnNlKG51bGwsIHsgc3RhdHVzOiAyMDQgfSlcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZGVsZXRpbmcgY3VzdG9tZXI6XCIsIGVycm9yKVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJGYWlsZWQgdG8gZGVsZXRlIGN1c3RvbWVyXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgIClcbiAgfVxufSAiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwic3VwYWJhc2VBZG1pbiIsIkdFVCIsInJlcXVlc3QiLCJkYXRhIiwiY3VzdG9tZXJzIiwiZXJyb3IiLCJmcm9tIiwic2VsZWN0Iiwib3JkZXIiLCJhc2NlbmRpbmciLCJqc29uIiwibWVzc2FnZSIsInN0YXR1cyIsIm1hcHBlZCIsIm1hcCIsImMiLCJpZCIsImVtYWlsIiwiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSIsImlzX2FjdGl2ZSIsImN1c3RvbWVyX3Byb2ZpbGVzIiwia3ljX3N0YXR1cyIsImt5Y192ZXJpZmljYXRpb25zIiwiY29uc29sZSIsIkVycm9yIiwiUE9TVCIsIm1heENvZGVSb3ciLCJsaW1pdCIsInNpbmdsZSIsIm5leHROdW1iZXIiLCJjb2RlIiwibWF0Y2giLCJwYXJzZUludCIsIm5ld0NvZGUiLCJ0b1N0cmluZyIsInBhZFN0YXJ0IiwiY3VzdG9tZXIiLCJjdXN0b21lckVycm9yIiwiaW5zZXJ0IiwiZmlyc3ROYW1lIiwibGFzdE5hbWUiLCJwaG9uZSIsInByb2ZpbGVFcnJvciIsImN1c3RvbWVyX2lkIiwiYWRkcmVzc19saW5lMSIsImFkZHJlc3NMaW5lMSIsImFkZHJlc3NfbGluZTIiLCJhZGRyZXNzTGluZTIiLCJjaXR5Iiwic3RhdGUiLCJ6aXBfY29kZSIsInppcENvZGUiLCJjb3VudHJ5IiwiZGF0ZV9vZl9iaXJ0aCIsImRhdGVPZkJpcnRoIiwidGF4X2lkIiwidGF4SWQiLCJvY2N1cGF0aW9uIiwiZW1wbG95ZXJfbmFtZSIsImVtcGxveWVyTmFtZSIsImFubnVhbF9pbmNvbWUiLCJhbm51YWxJbmNvbWUiLCJwYXJzZUZsb2F0Iiwic291cmNlX29mX2Z1bmRzIiwic291cmNlT2ZGdW5kcyIsIm5vdGVzIiwicmVjZWl2ZV9tYXJrZXRpbmdfZW1haWxzIiwicmVjZWl2ZU1hcmtldGluZ0VtYWlscyIsImt5Y0Vycm9yIiwiZG9jdW1lbnRfdHlwZSIsImt5Y1N0YXR1cyIsIlBVVCIsInVwZGF0ZURhdGEiLCJ1cGRhdGUiLCJlcSIsIkRFTEVURSIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsImdldCIsImRlbGV0ZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/customers/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase/admin.ts":
/*!*******************************!*\
  !*** ./lib/supabase/admin.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://rmyblssbxxoqmemfdupl.supabase.co\";\nconst supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;\nif (!supabaseUrl || !supabaseServiceRoleKey) {\n    throw new Error('Missing required Supabase environment variables');\n}\n// Create a Supabase client with service role key\nconst supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceRoleKey, {\n    auth: {\n        autoRefreshToken: true,\n        persistSession: true,\n        detectSessionInUrl: false\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UvYWRtaW4udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBb0Q7QUFFcEQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLHlCQUF5QkgsUUFBUUMsR0FBRyxDQUFDRyx5QkFBeUI7QUFFcEUsSUFBSSxDQUFDTCxlQUFlLENBQUNJLHdCQUF3QjtJQUMzQyxNQUFNLElBQUlFLE1BQU07QUFDbEI7QUFFQSxpREFBaUQ7QUFDMUMsTUFBTUMsZ0JBQWdCUixtRUFBWUEsQ0FBQ0MsYUFBYUksd0JBQXdCO0lBQzdFSSxNQUFNO1FBQ0pDLGtCQUFrQjtRQUNsQkMsZ0JBQWdCO1FBQ2hCQyxvQkFBb0I7SUFDdEI7QUFDRixHQUFFIiwic291cmNlcyI6WyIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2xpYi9zdXBhYmFzZS9hZG1pbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIVxuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlUm9sZUtleSA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkhXG5cbmlmICghc3VwYWJhc2VVcmwgfHwgIXN1cGFiYXNlU2VydmljZVJvbGVLZXkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIFN1cGFiYXNlIGVudmlyb25tZW50IHZhcmlhYmxlcycpXG59XG5cbi8vIENyZWF0ZSBhIFN1cGFiYXNlIGNsaWVudCB3aXRoIHNlcnZpY2Ugcm9sZSBrZXlcbmV4cG9ydCBjb25zdCBzdXBhYmFzZUFkbWluID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZVNlcnZpY2VSb2xlS2V5LCB7XG4gIGF1dGg6IHtcbiAgICBhdXRvUmVmcmVzaFRva2VuOiB0cnVlLFxuICAgIHBlcnNpc3RTZXNzaW9uOiB0cnVlLFxuICAgIGRldGVjdFNlc3Npb25JblVybDogZmFsc2UsXG4gIH1cbn0pICJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJzdXBhYmFzZVNlcnZpY2VSb2xlS2V5IiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIkVycm9yIiwic3VwYWJhc2VBZG1pbiIsImF1dGgiLCJhdXRvUmVmcmVzaFRva2VuIiwicGVyc2lzdFNlc3Npb24iLCJkZXRlY3RTZXNzaW9uSW5VcmwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase/admin.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcustomers%2Froute&page=%2Fapi%2Fadmin%2Fcustomers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcustomers%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcustomers%2Froute&page=%2Fapi%2Fadmin%2Fcustomers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcustomers%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_obedkafflu_Documents_GitHub_seedclub_app_api_admin_customers_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/customers/route.ts */ \"(rsc)/./app/api/admin/customers/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/customers/route\",\n        pathname: \"/api/admin/customers\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/customers/route\"\n    },\n    resolvedPagePath: \"/Users/obedkafflu/Documents/GitHub/seedclub/app/api/admin/customers/route.ts\",\n    nextConfigOutput,\n    userland: _Users_obedkafflu_Documents_GitHub_seedclub_app_api_admin_customers_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRmN1c3RvbWVycyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYWRtaW4lMkZjdXN0b21lcnMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhZG1pbiUyRmN1c3RvbWVycyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm9iZWRrYWZmbHUlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzZWVkY2x1YiUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZvYmVka2FmZmx1JTJGRG9jdW1lbnRzJTJGR2l0SHViJTJGc2VlZGNsdWImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzRCO0FBQ3pHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2FwcC9hcGkvYWRtaW4vY3VzdG9tZXJzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hZG1pbi9jdXN0b21lcnMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hZG1pbi9jdXN0b21lcnNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2FkbWluL2N1c3RvbWVycy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9vYmVka2FmZmx1L0RvY3VtZW50cy9HaXRIdWIvc2VlZGNsdWIvYXBwL2FwaS9hZG1pbi9jdXN0b21lcnMvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcustomers%2Froute&page=%2Fapi%2Fadmin%2Fcustomers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcustomers%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcustomers%2Froute&page=%2Fapi%2Fadmin%2Fcustomers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcustomers%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();