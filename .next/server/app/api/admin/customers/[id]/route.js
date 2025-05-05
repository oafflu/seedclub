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
exports.id = "app/api/admin/customers/[id]/route";
exports.ids = ["app/api/admin/customers/[id]/route"];
exports.modules = {

/***/ "(rsc)/./app/api/admin/customers/[id]/route.ts":
/*!***********************************************!*\
  !*** ./app/api/admin/customers/[id]/route.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase/admin */ \"(rsc)/./lib/supabase/admin.ts\");\n\n\nasync function GET(request, { params }) {\n    const id = params.id;\n    try {\n        // Try to fetch by id first, then by code if not found\n        let { data: customer, error } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customers\").select(`\n        *,\n        customer_profiles (*),\n        kyc_verifications (status),\n        customer_jars (\n          id,\n          initial_amount,\n          current_value\n        )\n      `).eq(\"id\", id).single();\n        // Now safe to log params.id\n        // console.log(\"API param id:\", params.id, \"length:\", params.id.length);\n        if ((!customer || error) && id.startsWith('CUST-')) {\n            ({ data: customer, error } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customers\").select(`\n          *,\n          customer_profiles (*),\n          kyc_verifications (status),\n          customer_jars (\n            id,\n            initial_amount,\n            current_value\n          )\n        `).ilike(\"code\", id).single());\n        // console.log(\"Customer by code:\", customer, \"Error:\", error);\n        }\n        if (error || !customer) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Customer not found\"\n            }, {\n                status: 404\n            });\n        }\n        // Map to CustomerProfile shape\n        const result = {\n            id: customer.id,\n            firstName: customer.first_name,\n            lastName: customer.last_name,\n            email: customer.email,\n            phone: customer.phone,\n            status: customer.is_active ? \"active\" : \"inactive\",\n            kycStatus: customer.kyc_verifications?.[0]?.status || \"pending\",\n            addressLine1: customer.customer_profiles?.address_line1,\n            addressLine2: customer.customer_profiles?.address_line2,\n            city: customer.customer_profiles?.city,\n            state: customer.customer_profiles?.state,\n            zipCode: customer.customer_profiles?.zip_code,\n            country: customer.customer_profiles?.country,\n            dateOfBirth: customer.customer_profiles?.date_of_birth,\n            taxId: customer.customer_profiles?.tax_id,\n            occupation: customer.customer_profiles?.occupation,\n            employerName: customer.customer_profiles?.employer_name,\n            annualIncome: customer.customer_profiles?.annual_income?.toString(),\n            sourceOfFunds: customer.customer_profiles?.source_of_funds,\n            notes: customer.customer_profiles?.notes,\n            receiveMarketingEmails: customer.customer_profiles?.receive_marketing_emails || false,\n            totalInvested: customer.customer_jars?.reduce((sum, jar)=>sum + jar.current_value, 0) || 0,\n            jars: customer.customer_jars?.length || 0,\n            createdAt: customer.created_at,\n            updatedAt: customer.updated_at\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(result);\n    } catch (error) {\n        console.error(\"Error fetching customer:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to fetch customer\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function PUT(request, { params }) {\n    const id = params.id;\n    try {\n        const data = await request.json();\n        const customer = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customers\").update(data).eq(\"id\", id).select().single();\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(customer);\n    } catch (error) {\n        console.error(\"Error updating customer:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to update customer\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function DELETE(request, { params }) {\n    const id = params.id;\n    try {\n        const customer = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from(\"customers\").delete().eq(\"id\", id).select().single();\n        return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(null, {\n            status: 204\n        });\n    } catch (error) {\n        console.error(\"Error deleting customer:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error instanceof Error ? error.message : \"Failed to delete customer\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL2N1c3RvbWVycy9baWRdL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQXVEO0FBQ0g7QUFFN0MsZUFBZUUsSUFBSUMsT0FBb0IsRUFBRSxFQUFFQyxNQUFNLEVBQThCO0lBQ3BGLE1BQU1DLEtBQUtELE9BQU9DLEVBQUU7SUFDcEIsSUFBSTtRQUNGLHNEQUFzRDtRQUN0RCxJQUFJLEVBQUVDLE1BQU1DLFFBQVEsRUFBRUMsS0FBSyxFQUFFLEdBQUcsTUFBTVAsOERBQWFBLENBQ2hEUSxJQUFJLENBQUMsYUFDTEMsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7OztNQVNULENBQUMsRUFDQUMsRUFBRSxDQUFDLE1BQU1OLElBQ1RPLE1BQU07UUFFVCw0QkFBNEI7UUFDNUIsd0VBQXdFO1FBRXhFLElBQUksQ0FBQyxDQUFDTCxZQUFZQyxLQUFJLEtBQU1ILEdBQUdRLFVBQVUsQ0FBQyxVQUFVO1lBQ2pELEdBQUVQLE1BQU1DLFFBQVEsRUFBRUMsS0FBSyxFQUFFLEdBQUcsTUFBTVAsOERBQWFBLENBQzdDUSxJQUFJLENBQUMsYUFDTEMsTUFBTSxDQUFDLENBQUM7Ozs7Ozs7OztRQVNULENBQUMsRUFDQUksS0FBSyxDQUFDLFFBQVFULElBQ2RPLE1BQU0sRUFBQztRQUNWLCtEQUErRDtRQUNqRTtRQUVBLElBQUlKLFNBQVMsQ0FBQ0QsVUFBVTtZQUN0QixPQUFPUCxxREFBWUEsQ0FBQ2UsSUFBSSxDQUN0QjtnQkFBRVAsT0FBTztZQUFxQixHQUM5QjtnQkFBRVEsUUFBUTtZQUFJO1FBRWxCO1FBRUEsK0JBQStCO1FBQy9CLE1BQU1DLFNBQVM7WUFDYlosSUFBSUUsU0FBU0YsRUFBRTtZQUNmYSxXQUFXWCxTQUFTWSxVQUFVO1lBQzlCQyxVQUFVYixTQUFTYyxTQUFTO1lBQzVCQyxPQUFPZixTQUFTZSxLQUFLO1lBQ3JCQyxPQUFPaEIsU0FBU2dCLEtBQUs7WUFDckJQLFFBQVFULFNBQVNpQixTQUFTLEdBQUcsV0FBVztZQUN4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cyI6WyIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2FwcC9hcGkvYWRtaW4vY3VzdG9tZXJzL1tpZF0vcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlLCBOZXh0UmVxdWVzdCB9IGZyb20gXCJuZXh0L3NlcnZlclwiXG5pbXBvcnQgeyBzdXBhYmFzZUFkbWluIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UvYWRtaW4nXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QsIHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IGlkOiBzdHJpbmcgfSB9KSB7XG4gIGNvbnN0IGlkID0gcGFyYW1zLmlkO1xuICB0cnkge1xuICAgIC8vIFRyeSB0byBmZXRjaCBieSBpZCBmaXJzdCwgdGhlbiBieSBjb2RlIGlmIG5vdCBmb3VuZFxuICAgIGxldCB7IGRhdGE6IGN1c3RvbWVyLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oXCJjdXN0b21lcnNcIilcbiAgICAgIC5zZWxlY3QoYFxuICAgICAgICAqLFxuICAgICAgICBjdXN0b21lcl9wcm9maWxlcyAoKiksXG4gICAgICAgIGt5Y192ZXJpZmljYXRpb25zIChzdGF0dXMpLFxuICAgICAgICBjdXN0b21lcl9qYXJzIChcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBpbml0aWFsX2Ftb3VudCxcbiAgICAgICAgICBjdXJyZW50X3ZhbHVlXG4gICAgICAgIClcbiAgICAgIGApXG4gICAgICAuZXEoXCJpZFwiLCBpZClcbiAgICAgIC5zaW5nbGUoKTtcblxuICAgIC8vIE5vdyBzYWZlIHRvIGxvZyBwYXJhbXMuaWRcbiAgICAvLyBjb25zb2xlLmxvZyhcIkFQSSBwYXJhbSBpZDpcIiwgcGFyYW1zLmlkLCBcImxlbmd0aDpcIiwgcGFyYW1zLmlkLmxlbmd0aCk7XG5cbiAgICBpZiAoKCFjdXN0b21lciB8fCBlcnJvcikgJiYgaWQuc3RhcnRzV2l0aCgnQ1VTVC0nKSkge1xuICAgICAgKHsgZGF0YTogY3VzdG9tZXIsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAgIC5mcm9tKFwiY3VzdG9tZXJzXCIpXG4gICAgICAgIC5zZWxlY3QoYFxuICAgICAgICAgICosXG4gICAgICAgICAgY3VzdG9tZXJfcHJvZmlsZXMgKCopLFxuICAgICAgICAgIGt5Y192ZXJpZmljYXRpb25zIChzdGF0dXMpLFxuICAgICAgICAgIGN1c3RvbWVyX2phcnMgKFxuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBpbml0aWFsX2Ftb3VudCxcbiAgICAgICAgICAgIGN1cnJlbnRfdmFsdWVcbiAgICAgICAgICApXG4gICAgICAgIGApXG4gICAgICAgIC5pbGlrZShcImNvZGVcIiwgaWQpXG4gICAgICAgIC5zaW5nbGUoKSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIkN1c3RvbWVyIGJ5IGNvZGU6XCIsIGN1c3RvbWVyLCBcIkVycm9yOlwiLCBlcnJvcik7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yIHx8ICFjdXN0b21lcikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiBcIkN1c3RvbWVyIG5vdCBmb3VuZFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDQgfVxuICAgICAgKVxuICAgIH1cblxuICAgIC8vIE1hcCB0byBDdXN0b21lclByb2ZpbGUgc2hhcGVcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICBpZDogY3VzdG9tZXIuaWQsXG4gICAgICBmaXJzdE5hbWU6IGN1c3RvbWVyLmZpcnN0X25hbWUsXG4gICAgICBsYXN0TmFtZTogY3VzdG9tZXIubGFzdF9uYW1lLFxuICAgICAgZW1haWw6IGN1c3RvbWVyLmVtYWlsLFxuICAgICAgcGhvbmU6IGN1c3RvbWVyLnBob25lLFxuICAgICAgc3RhdHVzOiBjdXN0b21lci5pc19hY3RpdmUgPyBcImFjdGl2ZVwiIDogXCJpbmFjdGl2ZVwiLFxuICAgICAga3ljU3RhdHVzOiBjdXN0b21lci5reWNfdmVyaWZpY2F0aW9ucz8uWzBdPy5zdGF0dXMgfHwgXCJwZW5kaW5nXCIsXG4gICAgICBhZGRyZXNzTGluZTE6IGN1c3RvbWVyLmN1c3RvbWVyX3Byb2ZpbGVzPy5hZGRyZXNzX2xpbmUxLFxuICAgICAgYWRkcmVzc0xpbmUyOiBjdXN0b21lci5jdXN0b21lcl9wcm9maWxlcz8uYWRkcmVzc19saW5lMixcbiAgICAgIGNpdHk6IGN1c3RvbWVyLmN1c3RvbWVyX3Byb2ZpbGVzPy5jaXR5LFxuICAgICAgc3RhdGU6IGN1c3RvbWVyLmN1c3RvbWVyX3Byb2ZpbGVzPy5zdGF0ZSxcbiAgICAgIHppcENvZGU6IGN1c3RvbWVyLmN1c3RvbWVyX3Byb2ZpbGVzPy56aXBfY29kZSxcbiAgICAgIGNvdW50cnk6IGN1c3RvbWVyLmN1c3RvbWVyX3Byb2ZpbGVzPy5jb3VudHJ5LFxuICAgICAgZGF0ZU9mQmlydGg6IGN1c3RvbWVyLmN1c3RvbWVyX3Byb2ZpbGVzPy5kYXRlX29mX2JpcnRoLFxuICAgICAgdGF4SWQ6IGN1c3RvbWVyLmN1c3RvbWVyX3Byb2ZpbGVzPy50YXhfaWQsXG4gICAgICBvY2N1cGF0aW9uOiBjdXN0b21lci5jdXN0b21lcl9wcm9maWxlcz8ub2NjdXBhdGlvbixcbiAgICAgIGVtcGxveWVyTmFtZTogY3VzdG9tZXIuY3VzdG9tZXJfcHJvZmlsZXM/LmVtcGxveWVyX25hbWUsXG4gICAgICBhbm51YWxJbmNvbWU6IGN1c3RvbWVyLmN1c3RvbWVyX3Byb2ZpbGVzPy5hbm51YWxfaW5jb21lPy50b1N0cmluZygpLFxuICAgICAgc291cmNlT2ZGdW5kczogY3VzdG9tZXIuY3VzdG9tZXJfcHJvZmlsZXM/LnNvdXJjZV9vZl9mdW5kcyxcbiAgICAgIG5vdGVzOiBjdXN0b21lci5jdXN0b21lcl9wcm9maWxlcz8ubm90ZXMsXG4gICAgICByZWNlaXZlTWFya2V0aW5nRW1haWxzOiBjdXN0b21lci5jdXN0b21lcl9wcm9maWxlcz8ucmVjZWl2ZV9tYXJrZXRpbmdfZW1haWxzIHx8IGZhbHNlLFxuICAgICAgdG90YWxJbnZlc3RlZDogY3VzdG9tZXIuY3VzdG9tZXJfamFycz8ucmVkdWNlKChzdW06IG51bWJlciwgamFyOiBhbnkpID0+IHN1bSArIGphci5jdXJyZW50X3ZhbHVlLCAwKSB8fCAwLFxuICAgICAgamFyczogY3VzdG9tZXIuY3VzdG9tZXJfamFycz8ubGVuZ3RoIHx8IDAsXG4gICAgICBjcmVhdGVkQXQ6IGN1c3RvbWVyLmNyZWF0ZWRfYXQsXG4gICAgICB1cGRhdGVkQXQ6IGN1c3RvbWVyLnVwZGF0ZWRfYXQsXG4gICAgfVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihyZXN1bHQpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGN1c3RvbWVyOlwiLCBlcnJvcilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiRmFpbGVkIHRvIGZldGNoIGN1c3RvbWVyXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUFVUKFxuICByZXF1ZXN0OiBSZXF1ZXN0LFxuICB7IHBhcmFtcyB9OiB7IHBhcmFtczogeyBpZDogc3RyaW5nIH0gfVxuKSB7XG4gIGNvbnN0IGlkID0gcGFyYW1zLmlkO1xuICB0cnkge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxuICAgIGNvbnN0IGN1c3RvbWVyID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oXCJjdXN0b21lcnNcIilcbiAgICAgIC51cGRhdGUoZGF0YSlcbiAgICAgIC5lcShcImlkXCIsIGlkKVxuICAgICAgLnNlbGVjdCgpXG4gICAgICAuc2luZ2xlKClcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oY3VzdG9tZXIpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIHVwZGF0aW5nIGN1c3RvbWVyOlwiLCBlcnJvcilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiRmFpbGVkIHRvIHVwZGF0ZSBjdXN0b21lclwiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIERFTEVURShcbiAgcmVxdWVzdDogUmVxdWVzdCxcbiAgeyBwYXJhbXMgfTogeyBwYXJhbXM6IHsgaWQ6IHN0cmluZyB9IH1cbikge1xuICBjb25zdCBpZCA9IHBhcmFtcy5pZDtcbiAgdHJ5IHtcbiAgICBjb25zdCBjdXN0b21lciA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKFwiY3VzdG9tZXJzXCIpXG4gICAgICAuZGVsZXRlKClcbiAgICAgIC5lcShcImlkXCIsIGlkKVxuICAgICAgLnNlbGVjdCgpXG4gICAgICAuc2luZ2xlKClcbiAgICByZXR1cm4gbmV3IE5leHRSZXNwb25zZShudWxsLCB7IHN0YXR1czogMjA0IH0pXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGRlbGV0aW5nIGN1c3RvbWVyOlwiLCBlcnJvcilcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiRmFpbGVkIHRvIGRlbGV0ZSBjdXN0b21lclwiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApXG4gIH1cbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInN1cGFiYXNlQWRtaW4iLCJHRVQiLCJyZXF1ZXN0IiwicGFyYW1zIiwiaWQiLCJkYXRhIiwiY3VzdG9tZXIiLCJlcnJvciIsImZyb20iLCJzZWxlY3QiLCJlcSIsInNpbmdsZSIsInN0YXJ0c1dpdGgiLCJpbGlrZSIsImpzb24iLCJzdGF0dXMiLCJyZXN1bHQiLCJmaXJzdE5hbWUiLCJmaXJzdF9uYW1lIiwibGFzdE5hbWUiLCJsYXN0X25hbWUiLCJlbWFpbCIsInBob25lIiwiaXNfYWN0aXZlIiwia3ljU3RhdHVzIiwia3ljX3ZlcmlmaWNhdGlvbnMiLCJhZGRyZXNzTGluZTEiLCJjdXN0b21lcl9wcm9maWxlcyIsImFkZHJlc3NfbGluZTEiLCJhZGRyZXNzTGluZTIiLCJhZGRyZXNzX2xpbmUyIiwiY2l0eSIsInN0YXRlIiwiemlwQ29kZSIsInppcF9jb2RlIiwiY291bnRyeSIsImRhdGVPZkJpcnRoIiwiZGF0ZV9vZl9iaXJ0aCIsInRheElkIiwidGF4X2lkIiwib2NjdXBhdGlvbiIsImVtcGxveWVyTmFtZSIsImVtcGxveWVyX25hbWUiLCJhbm51YWxJbmNvbWUiLCJhbm51YWxfaW5jb21lIiwidG9TdHJpbmciLCJzb3VyY2VPZkZ1bmRzIiwic291cmNlX29mX2Z1bmRzIiwibm90ZXMiLCJyZWNlaXZlTWFya2V0aW5nRW1haWxzIiwicmVjZWl2ZV9tYXJrZXRpbmdfZW1haWxzIiwidG90YWxJbnZlc3RlZCIsImN1c3RvbWVyX2phcnMiLCJyZWR1Y2UiLCJzdW0iLCJqYXIiLCJjdXJyZW50X3ZhbHVlIiwiamFycyIsImxlbmd0aCIsImNyZWF0ZWRBdCIsImNyZWF0ZWRfYXQiLCJ1cGRhdGVkQXQiLCJ1cGRhdGVkX2F0IiwiY29uc29sZSIsIkVycm9yIiwibWVzc2FnZSIsIlBVVCIsInVwZGF0ZSIsIkRFTEVURSIsImRlbGV0ZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/customers/[id]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase/admin.ts":
/*!*******************************!*\
  !*** ./lib/supabase/admin.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/.pnpm/@supabase+supabase-js@2.49.4/node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://rmyblssbxxoqmemfdupl.supabase.co\";\nconst supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;\nif (!supabaseUrl || !supabaseServiceRoleKey) {\n    throw new Error('Missing required Supabase environment variables');\n}\n// Create a Supabase client with service role key\nconst supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceRoleKey, {\n    auth: {\n        autoRefreshToken: true,\n        persistSession: true,\n        detectSessionInUrl: false\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UvYWRtaW4udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBb0Q7QUFFcEQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLHlCQUF5QkgsUUFBUUMsR0FBRyxDQUFDRyx5QkFBeUI7QUFFcEUsSUFBSSxDQUFDTCxlQUFlLENBQUNJLHdCQUF3QjtJQUMzQyxNQUFNLElBQUlFLE1BQU07QUFDbEI7QUFFQSxpREFBaUQ7QUFDMUMsTUFBTUMsZ0JBQWdCUixtRUFBWUEsQ0FBQ0MsYUFBYUksd0JBQXdCO0lBQzdFSSxNQUFNO1FBQ0pDLGtCQUFrQjtRQUNsQkMsZ0JBQWdCO1FBQ2hCQyxvQkFBb0I7SUFDdEI7QUFDRixHQUFFIiwic291cmNlcyI6WyIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2xpYi9zdXBhYmFzZS9hZG1pbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIVxuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlUm9sZUtleSA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkhXG5cbmlmICghc3VwYWJhc2VVcmwgfHwgIXN1cGFiYXNlU2VydmljZVJvbGVLZXkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIFN1cGFiYXNlIGVudmlyb25tZW50IHZhcmlhYmxlcycpXG59XG5cbi8vIENyZWF0ZSBhIFN1cGFiYXNlIGNsaWVudCB3aXRoIHNlcnZpY2Ugcm9sZSBrZXlcbmV4cG9ydCBjb25zdCBzdXBhYmFzZUFkbWluID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZVNlcnZpY2VSb2xlS2V5LCB7XG4gIGF1dGg6IHtcbiAgICBhdXRvUmVmcmVzaFRva2VuOiB0cnVlLFxuICAgIHBlcnNpc3RTZXNzaW9uOiB0cnVlLFxuICAgIGRldGVjdFNlc3Npb25JblVybDogZmFsc2UsXG4gIH1cbn0pICJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJzdXBhYmFzZVNlcnZpY2VSb2xlS2V5IiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIkVycm9yIiwic3VwYWJhc2VBZG1pbiIsImF1dGgiLCJhdXRvUmVmcmVzaFRva2VuIiwicGVyc2lzdFNlc3Npb24iLCJkZXRlY3RTZXNzaW9uSW5VcmwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase/admin.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute&page=%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute&page=%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_obedkafflu_Documents_GitHub_seedclub_app_api_admin_customers_id_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/customers/[id]/route.ts */ \"(rsc)/./app/api/admin/customers/[id]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/customers/[id]/route\",\n        pathname: \"/api/admin/customers/[id]\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/customers/[id]/route\"\n    },\n    resolvedPagePath: \"/Users/obedkafflu/Documents/GitHub/seedclub/app/api/admin/customers/[id]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_obedkafflu_Documents_GitHub_seedclub_app_api_admin_customers_id_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4yLjRfcmVhY3QtZG9tQDE5LjEuMF9yZWFjdEAxOS4xLjBfX3JlYWN0QDE5LjEuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRmN1c3RvbWVycyUyRiU1QmlkJTVEJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhZG1pbiUyRmN1c3RvbWVycyUyRiU1QmlkJTVEJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYWRtaW4lMkZjdXN0b21lcnMlMkYlNUJpZCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm9iZWRrYWZmbHUlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzZWVkY2x1YiUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZvYmVka2FmZmx1JTJGRG9jdW1lbnRzJTJGR2l0SHViJTJGc2VlZGNsdWImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2lDO0FBQzlHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2FwcC9hcGkvYWRtaW4vY3VzdG9tZXJzL1tpZF0vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2FkbWluL2N1c3RvbWVycy9baWRdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYWRtaW4vY3VzdG9tZXJzL1tpZF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2FkbWluL2N1c3RvbWVycy9baWRdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL29iZWRrYWZmbHUvRG9jdW1lbnRzL0dpdEh1Yi9zZWVkY2x1Yi9hcHAvYXBpL2FkbWluL2N1c3RvbWVycy9baWRdL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute&page=%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
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
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0","vendor-chunks/tr46@0.0.3","vendor-chunks/@supabase+auth-js@2.69.1","vendor-chunks/@supabase+realtime-js@2.11.2","vendor-chunks/@supabase+postgrest-js@1.19.4","vendor-chunks/@supabase+node-fetch@2.6.15","vendor-chunks/whatwg-url@5.0.0","vendor-chunks/@supabase+storage-js@2.7.1","vendor-chunks/@supabase+supabase-js@2.49.4","vendor-chunks/@supabase+functions-js@2.4.4","vendor-chunks/webidl-conversions@3.0.1"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute&page=%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fcustomers%2F%5Bid%5D%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();