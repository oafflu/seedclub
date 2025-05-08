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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase/admin */ \"(rsc)/./lib/supabase/admin.ts\");\n\n\nasync function GET() {\n    try {\n        const { data: customers, error } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('customers').select('*');\n        if (error) throw error;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(customers);\n    } catch (error) {\n        console.error(\"Error fetching customers:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to fetch customers\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const data = await request.json();\n        // Generate next customer code\n        const { data: maxCodeRow } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customers\").select(\"code\").order(\"created_at\", {\n            ascending: false\n        }).limit(1).single();\n        let nextNumber = 1;\n        if (maxCodeRow && maxCodeRow.code) {\n            const match = maxCodeRow.code.match(/CUST-(\\d+)/);\n            if (match) nextNumber = parseInt(match[1], 10) + 1;\n        }\n        const newCode = `CUST-${nextNumber.toString().padStart(3, '0')}`;\n        // Create customer\n        const { data: customer, error: customerError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customers\").insert({\n            code: newCode,\n            first_name: data.firstName,\n            last_name: data.lastName,\n            email: data.email,\n            phone: data.phone,\n            is_active: data.status === \"active\"\n        }).select().single();\n        if (customerError) throw customerError;\n        // Create customer profile\n        const { error: profileError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customer_profiles\").insert({\n            customer_id: customer.id,\n            address_line1: data.addressLine1,\n            address_line2: data.addressLine2,\n            city: data.city,\n            state: data.state,\n            zip_code: data.zipCode,\n            country: data.country,\n            date_of_birth: data.dateOfBirth,\n            tax_id: data.taxId,\n            occupation: data.occupation,\n            employer_name: data.employerName,\n            annual_income: data.annualIncome ? parseFloat(data.annualIncome.toString()) : null,\n            source_of_funds: data.sourceOfFunds,\n            notes: data.notes,\n            receive_marketing_emails: data.receiveMarketingEmails\n        });\n        if (profileError) throw profileError;\n        // Create initial KYC verification record\n        const { error: kycError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"kyc_verifications\").insert({\n            customer_id: customer.id,\n            document_type: \"pending\",\n            status: data.kycStatus || \"pending\"\n        });\n        if (kycError) throw kycError;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(customer, {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"Error creating customer:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to create customer\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function PUT(request) {\n    try {\n        const data = await request.json();\n        const { id, ...updateData } = data;\n        if (!id) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Customer ID is required\"\n            }, {\n                status: 400\n            });\n        }\n        // Update customer\n        const { data: customer, error } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('customers').update(updateData).eq('id', id).select().single();\n        if (error) throw error;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(customer);\n    } catch (error) {\n        console.error(\"Error updating customer:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to update customer\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function DELETE(request) {\n    try {\n        const { searchParams } = new URL(request.url);\n        const id = searchParams.get(\"id\");\n        if (!id) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Customer ID is required\"\n            }, {\n                status: 400\n            });\n        }\n        // Delete customer\n        const { error } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('customers').delete().eq('id', id);\n        if (error) throw error;\n        return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(null, {\n            status: 204\n        });\n    } catch (error) {\n        console.error(\"Error deleting customer:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to delete customer\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtZQUFFSCxPQUFPQSxpQkFBaUJLLFFBQVFMLE1BQU1NLE9BQU8sR0FBRztRQUE0QixHQUM5RTtZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRjtBQUVPLGVBQWUyRCxPQUFPekQsT0FBZ0I7SUFDM0MsSUFBSTtRQUNGLE1BQU0sRUFBRTBELFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUkzRCxRQUFRNEQsR0FBRztRQUM1QyxNQUFNbkMsS0FBS2lDLGFBQWFHLEdBQUcsQ0FBQztRQUM1QixJQUFJLENBQUNwQyxJQUFJO1lBQ1AsT0FBT3ZDLHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7Z0JBQUVILE9BQU87WUFBMEIsR0FBRztnQkFBRU8sUUFBUTtZQUFJO1FBQy9FO1FBQ0Esa0JBQWtCO1FBQ2xCLE1BQU0sRUFBRVAsS0FBSyxFQUFFLEdBQUcsTUFBTUosOERBQWFBLENBQUNLLElBQUksQ0FBQyxhQUFhc0UsTUFBTSxHQUFHTixFQUFFLENBQUMsTUFBTS9CO1FBQzFFLElBQUlsQyxPQUFPLE1BQU1BO1FBQ2pCLE9BQU8sSUFBSUwscURBQVlBLENBQUMsTUFBTTtZQUFFWSxRQUFRO1FBQUk7SUFDOUMsRUFBRSxPQUFPUCxPQUFPO1FBQ2RJLFFBQVFKLEtBQUssQ0FBQyw0QkFBNEJBO1FBQzFDLE9BQU9MLHFEQUFZQSxDQUFDUSxJQUFJLENBQ3RCO1lBQUVILE9BQU9BLGlCQUFpQkssUUFBUUwsTUFBTU0sT0FBTyxHQUFHO1FBQTRCLEdBQzlFO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2FwcC9hcGkvYWRtaW4vY3VzdG9tZXJzL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiXG5pbXBvcnQgeyBzdXBhYmFzZUFkbWluIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UvYWRtaW4nXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBkYXRhOiBjdXN0b21lcnMsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluLmZyb20oJ2N1c3RvbWVycycpLnNlbGVjdCgnKicpXG4gICAgaWYgKGVycm9yKSB0aHJvdyBlcnJvclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihjdXN0b21lcnMpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGN1c3RvbWVyczpcIiwgZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byBmZXRjaCBjdXN0b21lcnNcIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVxdWVzdC5qc29uKClcbiAgICAvLyBHZW5lcmF0ZSBuZXh0IGN1c3RvbWVyIGNvZGVcbiAgICBjb25zdCB7IGRhdGE6IG1heENvZGVSb3cgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKFwiY3VzdG9tZXJzXCIpXG4gICAgICAuc2VsZWN0KFwiY29kZVwiKVxuICAgICAgLm9yZGVyKFwiY3JlYXRlZF9hdFwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcbiAgICAgIC5saW1pdCgxKVxuICAgICAgLnNpbmdsZSgpO1xuICAgIGxldCBuZXh0TnVtYmVyID0gMTtcbiAgICBpZiAobWF4Q29kZVJvdyAmJiBtYXhDb2RlUm93LmNvZGUpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gbWF4Q29kZVJvdy5jb2RlLm1hdGNoKC9DVVNULShcXGQrKS8pO1xuICAgICAgaWYgKG1hdGNoKSBuZXh0TnVtYmVyID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKSArIDE7XG4gICAgfVxuICAgIGNvbnN0IG5ld0NvZGUgPSBgQ1VTVC0ke25leHROdW1iZXIudG9TdHJpbmcoKS5wYWRTdGFydCgzLCAnMCcpfWA7XG4gICAgLy8gQ3JlYXRlIGN1c3RvbWVyXG4gICAgY29uc3QgeyBkYXRhOiBjdXN0b21lciwgZXJyb3I6IGN1c3RvbWVyRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW4uZnJvbShcImN1c3RvbWVyc1wiKS5pbnNlcnQoe1xuICAgICAgY29kZTogbmV3Q29kZSxcbiAgICAgIGZpcnN0X25hbWU6IGRhdGEuZmlyc3ROYW1lLFxuICAgICAgbGFzdF9uYW1lOiBkYXRhLmxhc3ROYW1lLFxuICAgICAgZW1haWw6IGRhdGEuZW1haWwsXG4gICAgICBwaG9uZTogZGF0YS5waG9uZSxcbiAgICAgIGlzX2FjdGl2ZTogZGF0YS5zdGF0dXMgPT09IFwiYWN0aXZlXCIsXG4gICAgfSkuc2VsZWN0KCkuc2luZ2xlKClcbiAgICBpZiAoY3VzdG9tZXJFcnJvcikgdGhyb3cgY3VzdG9tZXJFcnJvclxuXG4gICAgLy8gQ3JlYXRlIGN1c3RvbWVyIHByb2ZpbGVcbiAgICBjb25zdCB7IGVycm9yOiBwcm9maWxlRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW4uZnJvbShcImN1c3RvbWVyX3Byb2ZpbGVzXCIpLmluc2VydCh7XG4gICAgICBjdXN0b21lcl9pZDogY3VzdG9tZXIuaWQsXG4gICAgICBhZGRyZXNzX2xpbmUxOiBkYXRhLmFkZHJlc3NMaW5lMSxcbiAgICAgIGFkZHJlc3NfbGluZTI6IGRhdGEuYWRkcmVzc0xpbmUyLFxuICAgICAgY2l0eTogZGF0YS5jaXR5LFxuICAgICAgc3RhdGU6IGRhdGEuc3RhdGUsXG4gICAgICB6aXBfY29kZTogZGF0YS56aXBDb2RlLFxuICAgICAgY291bnRyeTogZGF0YS5jb3VudHJ5LFxuICAgICAgZGF0ZV9vZl9iaXJ0aDogZGF0YS5kYXRlT2ZCaXJ0aCxcbiAgICAgIHRheF9pZDogZGF0YS50YXhJZCxcbiAgICAgIG9jY3VwYXRpb246IGRhdGEub2NjdXBhdGlvbixcbiAgICAgIGVtcGxveWVyX25hbWU6IGRhdGEuZW1wbG95ZXJOYW1lLFxuICAgICAgYW5udWFsX2luY29tZTogZGF0YS5hbm51YWxJbmNvbWUgPyBwYXJzZUZsb2F0KGRhdGEuYW5udWFsSW5jb21lLnRvU3RyaW5nKCkpIDogbnVsbCxcbiAgICAgIHNvdXJjZV9vZl9mdW5kczogZGF0YS5zb3VyY2VPZkZ1bmRzLFxuICAgICAgbm90ZXM6IGRhdGEubm90ZXMsXG4gICAgICByZWNlaXZlX21hcmtldGluZ19lbWFpbHM6IGRhdGEucmVjZWl2ZU1hcmtldGluZ0VtYWlscyxcbiAgICB9KVxuICAgIGlmIChwcm9maWxlRXJyb3IpIHRocm93IHByb2ZpbGVFcnJvclxuXG4gICAgLy8gQ3JlYXRlIGluaXRpYWwgS1lDIHZlcmlmaWNhdGlvbiByZWNvcmRcbiAgICBjb25zdCB7IGVycm9yOiBreWNFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pbi5mcm9tKFwia3ljX3ZlcmlmaWNhdGlvbnNcIikuaW5zZXJ0KHtcbiAgICAgIGN1c3RvbWVyX2lkOiBjdXN0b21lci5pZCxcbiAgICAgIGRvY3VtZW50X3R5cGU6IFwicGVuZGluZ1wiLFxuICAgICAgc3RhdHVzOiBkYXRhLmt5Y1N0YXR1cyB8fCBcInBlbmRpbmdcIixcbiAgICB9KVxuICAgIGlmIChreWNFcnJvcikgdGhyb3cga3ljRXJyb3JcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihjdXN0b21lciwgeyBzdGF0dXM6IDIwMSB9KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjcmVhdGluZyBjdXN0b21lcjpcIiwgZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byBjcmVhdGUgY3VzdG9tZXJcIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQVVQocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxuICAgIGNvbnN0IHsgaWQsIC4uLnVwZGF0ZURhdGEgfSA9IGRhdGFcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJDdXN0b21lciBJRCBpcyByZXF1aXJlZFwiIH0sIHsgc3RhdHVzOiA0MDAgfSlcbiAgICB9XG4gICAgLy8gVXBkYXRlIGN1c3RvbWVyXG4gICAgY29uc3QgeyBkYXRhOiBjdXN0b21lciwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW4uZnJvbSgnY3VzdG9tZXJzJykudXBkYXRlKHVwZGF0ZURhdGEpLmVxKCdpZCcsIGlkKS5zZWxlY3QoKS5zaW5nbGUoKVxuICAgIGlmIChlcnJvcikgdGhyb3cgZXJyb3JcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oY3VzdG9tZXIpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIHVwZGF0aW5nIGN1c3RvbWVyOlwiLCBlcnJvcilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiRmFpbGVkIHRvIHVwZGF0ZSBjdXN0b21lclwiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIERFTEVURShyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBzZWFyY2hQYXJhbXMgfSA9IG5ldyBVUkwocmVxdWVzdC51cmwpXG4gICAgY29uc3QgaWQgPSBzZWFyY2hQYXJhbXMuZ2V0KFwiaWRcIilcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJDdXN0b21lciBJRCBpcyByZXF1aXJlZFwiIH0sIHsgc3RhdHVzOiA0MDAgfSlcbiAgICB9XG4gICAgLy8gRGVsZXRlIGN1c3RvbWVyXG4gICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pbi5mcm9tKCdjdXN0b21lcnMnKS5kZWxldGUoKS5lcSgnaWQnLCBpZClcbiAgICBpZiAoZXJyb3IpIHRocm93IGVycm9yXG4gICAgcmV0dXJuIG5ldyBOZXh0UmVzcG9uc2UobnVsbCwgeyBzdGF0dXM6IDIwNCB9KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBkZWxldGluZyBjdXN0b21lcjpcIiwgZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIkZhaWxlZCB0byBkZWxldGUgY3VzdG9tZXJcIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59ICJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJzdXBhYmFzZUFkbWluIiwiR0VUIiwiZGF0YSIsImN1c3RvbWVycyIsImVycm9yIiwiZnJvbSIsInNlbGVjdCIsImpzb24iLCJjb25zb2xlIiwiRXJyb3IiLCJtZXNzYWdlIiwic3RhdHVzIiwiUE9TVCIsInJlcXVlc3QiLCJtYXhDb2RlUm93Iiwib3JkZXIiLCJhc2NlbmRpbmciLCJsaW1pdCIsInNpbmdsZSIsIm5leHROdW1iZXIiLCJjb2RlIiwibWF0Y2giLCJwYXJzZUludCIsIm5ld0NvZGUiLCJ0b1N0cmluZyIsInBhZFN0YXJ0IiwiY3VzdG9tZXIiLCJjdXN0b21lckVycm9yIiwiaW5zZXJ0IiwiZmlyc3RfbmFtZSIsImZpcnN0TmFtZSIsImxhc3RfbmFtZSIsImxhc3ROYW1lIiwiZW1haWwiLCJwaG9uZSIsImlzX2FjdGl2ZSIsInByb2ZpbGVFcnJvciIsImN1c3RvbWVyX2lkIiwiaWQiLCJhZGRyZXNzX2xpbmUxIiwiYWRkcmVzc0xpbmUxIiwiYWRkcmVzc19saW5lMiIsImFkZHJlc3NMaW5lMiIsImNpdHkiLCJzdGF0ZSIsInppcF9jb2RlIiwiemlwQ29kZSIsImNvdW50cnkiLCJkYXRlX29mX2JpcnRoIiwiZGF0ZU9mQmlydGgiLCJ0YXhfaWQiLCJ0YXhJZCIsIm9jY3VwYXRpb24iLCJlbXBsb3llcl9uYW1lIiwiZW1wbG95ZXJOYW1lIiwiYW5udWFsX2luY29tZSIsImFubnVhbEluY29tZSIsInBhcnNlRmxvYXQiLCJzb3VyY2Vfb2ZfZnVuZHMiLCJzb3VyY2VPZkZ1bmRzIiwibm90ZXMiLCJyZWNlaXZlX21hcmtldGluZ19lbWFpbHMiLCJyZWNlaXZlTWFya2V0aW5nRW1haWxzIiwia3ljRXJyb3IiLCJkb2N1bWVudF90eXBlIiwia3ljU3RhdHVzIiwiUFVUIiwidXBkYXRlRGF0YSIsInVwZGF0ZSIsImVxIiwiREVMRVRFIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwiZ2V0IiwiZGVsZXRlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/customers/route.ts\n");

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