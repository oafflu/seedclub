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
exports.id = "app/api/admin/dashboard/route";
exports.ids = ["app/api/admin/dashboard/route"];
exports.modules = {

/***/ "(rsc)/./app/api/admin/dashboard/route.ts":
/*!******************************************!*\
  !*** ./app/api/admin/dashboard/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase/admin */ \"(rsc)/./lib/supabase/admin.ts\");\n\n\nasync function GET() {\n    try {\n        // Total customers\n        const { count: totalCustomers } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('customers').select('*', {\n            count: 'exact',\n            head: true\n        });\n        // Total value locked (sum of all customer_jars current_value)\n        const { data: jarValues, error: jarError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('customer_jars').select('current_value');\n        const totalValueLocked = jarValues?.reduce((sum, j)=>sum + (j.current_value || 0), 0) || 0;\n        // Active jars\n        const { count: activeJars } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('jars').select('*', {\n            count: 'exact',\n            head: true\n        }).eq('is_active', true);\n        // Average APY (average of all jars' apy field)\n        const { data: jars, error: jarsError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('jars').select('apy');\n        const apys = jars?.map((j)=>j.apy).filter(Number.isFinite);\n        const averageApy = apys && apys.length > 0 ? apys.reduce((a, b)=>a + b, 0) / apys.length : 0;\n        // Overview chart data (monthly total value locked for last 7 months)\n        const { data: monthly, error: monthlyError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.rpc('dashboard_monthly_tvl');\n        // Fallback: use empty array if no RPC\n        const overview = monthly || [];\n        // Recent activity (last 5 transactions)\n        const { data: recent, error: recentError } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('transactions').select('id, amount, type, created_at, customer:customers(name), jar:jars(name)').order('created_at', {\n            ascending: false\n        }).limit(5);\n        // --- Analytics for Analytics Tab ---\n        // Total invested (sum of all completed deposit transactions)\n        const { data: depositTxs } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('transactions').select('amount, status, type').eq('type', 'deposit').eq('status', 'completed');\n        const totalInvested = depositTxs?.reduce((sum, t)=>sum + (t.amount || 0), 0) || 0;\n        // Monthly revenue (sum of all completed interest transactions for current month)\n        const now = new Date();\n        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();\n        const { data: interestTxs } = await _lib_supabase_admin__WEBPACK_IMPORTED_MODULE_1__.supabaseAdmin.from('transactions').select('amount, status, type, created_at').eq('type', 'interest').eq('status', 'completed').gte('created_at', monthStart);\n        const monthlyRevenue = interestTxs?.reduce((sum, t)=>sum + (t.amount || 0), 0) || 0;\n        // Conversion rate (placeholder: totalCustomers / 100 for now)\n        const conversionRate = totalCustomers ? Math.round(totalCustomers / 100 * 1000) / 10 : 0;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            totalCustomers,\n            totalValueLocked,\n            activeJars,\n            averageApy,\n            overview,\n            recent,\n            totalInvested,\n            monthlyRevenue,\n            conversionRate\n        });\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to load dashboard metrics'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL2Rhc2hib2FyZC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMEM7QUFDVTtBQUU3QyxlQUFlRTtJQUNwQixJQUFJO1FBQ0Ysa0JBQWtCO1FBQ2xCLE1BQU0sRUFBRUMsT0FBT0MsY0FBYyxFQUFFLEdBQUcsTUFBTUgsOERBQWFBLENBQ2xESSxJQUFJLENBQUMsYUFDTEMsTUFBTSxDQUFDLEtBQUs7WUFBRUgsT0FBTztZQUFTSSxNQUFNO1FBQUs7UUFFNUMsOERBQThEO1FBQzlELE1BQU0sRUFBRUMsTUFBTUMsU0FBUyxFQUFFQyxPQUFPQyxRQUFRLEVBQUUsR0FBRyxNQUFNViw4REFBYUEsQ0FDN0RJLElBQUksQ0FBQyxpQkFDTEMsTUFBTSxDQUFDO1FBQ1YsTUFBTU0sbUJBQW1CSCxXQUFXSSxPQUFPLENBQUNDLEtBQUtDLElBQU1ELE1BQU9DLENBQUFBLEVBQUVDLGFBQWEsSUFBSSxJQUFJLE1BQU07UUFFM0YsY0FBYztRQUNkLE1BQU0sRUFBRWIsT0FBT2MsVUFBVSxFQUFFLEdBQUcsTUFBTWhCLDhEQUFhQSxDQUM5Q0ksSUFBSSxDQUFDLFFBQ0xDLE1BQU0sQ0FBQyxLQUFLO1lBQUVILE9BQU87WUFBU0ksTUFBTTtRQUFLLEdBQ3pDVyxFQUFFLENBQUMsYUFBYTtRQUVuQiwrQ0FBK0M7UUFDL0MsTUFBTSxFQUFFVixNQUFNVyxJQUFJLEVBQUVULE9BQU9VLFNBQVMsRUFBRSxHQUFHLE1BQU1uQiw4REFBYUEsQ0FDekRJLElBQUksQ0FBQyxRQUNMQyxNQUFNLENBQUM7UUFDVixNQUFNZSxPQUFPRixNQUFNRyxJQUFJUCxDQUFBQSxJQUFLQSxFQUFFUSxHQUFHLEVBQUVDLE9BQU9DLE9BQU9DLFFBQVE7UUFDekQsTUFBTUMsYUFBYU4sUUFBUUEsS0FBS08sTUFBTSxHQUFHLElBQUtQLEtBQUtSLE1BQU0sQ0FBQyxDQUFDZ0IsR0FBR0MsSUFBTUQsSUFBSUMsR0FBRyxLQUFLVCxLQUFLTyxNQUFNLEdBQUk7UUFFL0YscUVBQXFFO1FBQ3JFLE1BQU0sRUFBRXBCLE1BQU11QixPQUFPLEVBQUVyQixPQUFPc0IsWUFBWSxFQUFFLEdBQUcsTUFBTS9CLDhEQUFhQSxDQUFDZ0MsR0FBRyxDQUFDO1FBQ3ZFLHNDQUFzQztRQUN0QyxNQUFNQyxXQUFXSCxXQUFXLEVBQUU7UUFFOUIsd0NBQXdDO1FBQ3hDLE1BQU0sRUFBRXZCLE1BQU0yQixNQUFNLEVBQUV6QixPQUFPMEIsV0FBVyxFQUFFLEdBQUcsTUFBTW5DLDhEQUFhQSxDQUM3REksSUFBSSxDQUFDLGdCQUNMQyxNQUFNLENBQUMsMEVBQ1ArQixLQUFLLENBQUMsY0FBYztZQUFFQyxXQUFXO1FBQU0sR0FDdkNDLEtBQUssQ0FBQztRQUVULHNDQUFzQztRQUN0Qyw2REFBNkQ7UUFDN0QsTUFBTSxFQUFFL0IsTUFBTWdDLFVBQVUsRUFBRSxHQUFHLE1BQU12Qyw4REFBYUEsQ0FDN0NJLElBQUksQ0FBQyxnQkFDTEMsTUFBTSxDQUFDLHdCQUNQWSxFQUFFLENBQUMsUUFBUSxXQUNYQSxFQUFFLENBQUMsVUFBVTtRQUNoQixNQUFNdUIsZ0JBQWdCRCxZQUFZM0IsT0FBTyxDQUFDQyxLQUFLNEIsSUFBTTVCLE1BQU80QixDQUFBQSxFQUFFQyxNQUFNLElBQUksSUFBSSxNQUFNO1FBRWxGLGlGQUFpRjtRQUNqRixNQUFNQyxNQUFNLElBQUlDO1FBQ2hCLE1BQU1DLGFBQWEsSUFBSUQsS0FBS0QsSUFBSUcsV0FBVyxJQUFJSCxJQUFJSSxRQUFRLElBQUksR0FBR0MsV0FBVztRQUM3RSxNQUFNLEVBQUV6QyxNQUFNMEMsV0FBVyxFQUFFLEdBQUcsTUFBTWpELDhEQUFhQSxDQUM5Q0ksSUFBSSxDQUFDLGdCQUNMQyxNQUFNLENBQUMsb0NBQ1BZLEVBQUUsQ0FBQyxRQUFRLFlBQ1hBLEVBQUUsQ0FBQyxVQUFVLGFBQ2JpQyxHQUFHLENBQUMsY0FBY0w7UUFDckIsTUFBTU0saUJBQWlCRixhQUFhckMsT0FBTyxDQUFDQyxLQUFLNEIsSUFBTTVCLE1BQU80QixDQUFBQSxFQUFFQyxNQUFNLElBQUksSUFBSSxNQUFNO1FBRXBGLDhEQUE4RDtRQUM5RCxNQUFNVSxpQkFBaUJqRCxpQkFBaUJrRCxLQUFLQyxLQUFLLENBQUMsaUJBQWtCLE1BQU8sUUFBUSxLQUFLO1FBRXpGLE9BQU92RCxxREFBWUEsQ0FBQ3dELElBQUksQ0FBQztZQUN2QnBEO1lBQ0FRO1lBQ0FLO1lBQ0FVO1lBQ0FPO1lBQ0FDO1lBQ0FNO1lBQ0FXO1lBQ0FDO1FBQ0Y7SUFDRixFQUFFLE9BQU8zQyxPQUFPO1FBQ2QsT0FBT1YscURBQVlBLENBQUN3RCxJQUFJLENBQUM7WUFBRTlDLE9BQU87UUFBbUMsR0FBRztZQUFFK0MsUUFBUTtRQUFJO0lBQ3hGO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9vYmVka2FmZmx1L0RvY3VtZW50cy9HaXRIdWIvc2VlZGNsdWIvYXBwL2FwaS9hZG1pbi9kYXNoYm9hcmQvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgeyBzdXBhYmFzZUFkbWluIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UvYWRtaW4nXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgLy8gVG90YWwgY3VzdG9tZXJzXG4gICAgY29uc3QgeyBjb3VudDogdG90YWxDdXN0b21lcnMgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCdjdXN0b21lcnMnKVxuICAgICAgLnNlbGVjdCgnKicsIHsgY291bnQ6ICdleGFjdCcsIGhlYWQ6IHRydWUgfSlcblxuICAgIC8vIFRvdGFsIHZhbHVlIGxvY2tlZCAoc3VtIG9mIGFsbCBjdXN0b21lcl9qYXJzIGN1cnJlbnRfdmFsdWUpXG4gICAgY29uc3QgeyBkYXRhOiBqYXJWYWx1ZXMsIGVycm9yOiBqYXJFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ2N1c3RvbWVyX2phcnMnKVxuICAgICAgLnNlbGVjdCgnY3VycmVudF92YWx1ZScpXG4gICAgY29uc3QgdG90YWxWYWx1ZUxvY2tlZCA9IGphclZhbHVlcz8ucmVkdWNlKChzdW0sIGopID0+IHN1bSArIChqLmN1cnJlbnRfdmFsdWUgfHwgMCksIDApIHx8IDBcblxuICAgIC8vIEFjdGl2ZSBqYXJzXG4gICAgY29uc3QgeyBjb3VudDogYWN0aXZlSmFycyB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ2phcnMnKVxuICAgICAgLnNlbGVjdCgnKicsIHsgY291bnQ6ICdleGFjdCcsIGhlYWQ6IHRydWUgfSlcbiAgICAgIC5lcSgnaXNfYWN0aXZlJywgdHJ1ZSlcblxuICAgIC8vIEF2ZXJhZ2UgQVBZIChhdmVyYWdlIG9mIGFsbCBqYXJzJyBhcHkgZmllbGQpXG4gICAgY29uc3QgeyBkYXRhOiBqYXJzLCBlcnJvcjogamFyc0Vycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAuZnJvbSgnamFycycpXG4gICAgICAuc2VsZWN0KCdhcHknKVxuICAgIGNvbnN0IGFweXMgPSBqYXJzPy5tYXAoaiA9PiBqLmFweSkuZmlsdGVyKE51bWJlci5pc0Zpbml0ZSlcbiAgICBjb25zdCBhdmVyYWdlQXB5ID0gYXB5cyAmJiBhcHlzLmxlbmd0aCA+IDAgPyAoYXB5cy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKSAvIGFweXMubGVuZ3RoKSA6IDBcblxuICAgIC8vIE92ZXJ2aWV3IGNoYXJ0IGRhdGEgKG1vbnRobHkgdG90YWwgdmFsdWUgbG9ja2VkIGZvciBsYXN0IDcgbW9udGhzKVxuICAgIGNvbnN0IHsgZGF0YTogbW9udGhseSwgZXJyb3I6IG1vbnRobHlFcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pbi5ycGMoJ2Rhc2hib2FyZF9tb250aGx5X3R2bCcpXG4gICAgLy8gRmFsbGJhY2s6IHVzZSBlbXB0eSBhcnJheSBpZiBubyBSUENcbiAgICBjb25zdCBvdmVydmlldyA9IG1vbnRobHkgfHwgW11cblxuICAgIC8vIFJlY2VudCBhY3Rpdml0eSAobGFzdCA1IHRyYW5zYWN0aW9ucylcbiAgICBjb25zdCB7IGRhdGE6IHJlY2VudCwgZXJyb3I6IHJlY2VudEVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZUFkbWluXG4gICAgICAuZnJvbSgndHJhbnNhY3Rpb25zJylcbiAgICAgIC5zZWxlY3QoJ2lkLCBhbW91bnQsIHR5cGUsIGNyZWF0ZWRfYXQsIGN1c3RvbWVyOmN1c3RvbWVycyhuYW1lKSwgamFyOmphcnMobmFtZSknKVxuICAgICAgLm9yZGVyKCdjcmVhdGVkX2F0JywgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXG4gICAgICAubGltaXQoNSlcblxuICAgIC8vIC0tLSBBbmFseXRpY3MgZm9yIEFuYWx5dGljcyBUYWIgLS0tXG4gICAgLy8gVG90YWwgaW52ZXN0ZWQgKHN1bSBvZiBhbGwgY29tcGxldGVkIGRlcG9zaXQgdHJhbnNhY3Rpb25zKVxuICAgIGNvbnN0IHsgZGF0YTogZGVwb3NpdFR4cyB9ID0gYXdhaXQgc3VwYWJhc2VBZG1pblxuICAgICAgLmZyb20oJ3RyYW5zYWN0aW9ucycpXG4gICAgICAuc2VsZWN0KCdhbW91bnQsIHN0YXR1cywgdHlwZScpXG4gICAgICAuZXEoJ3R5cGUnLCAnZGVwb3NpdCcpXG4gICAgICAuZXEoJ3N0YXR1cycsICdjb21wbGV0ZWQnKVxuICAgIGNvbnN0IHRvdGFsSW52ZXN0ZWQgPSBkZXBvc2l0VHhzPy5yZWR1Y2UoKHN1bSwgdCkgPT4gc3VtICsgKHQuYW1vdW50IHx8IDApLCAwKSB8fCAwXG5cbiAgICAvLyBNb250aGx5IHJldmVudWUgKHN1bSBvZiBhbGwgY29tcGxldGVkIGludGVyZXN0IHRyYW5zYWN0aW9ucyBmb3IgY3VycmVudCBtb250aClcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpXG4gICAgY29uc3QgbW9udGhTdGFydCA9IG5ldyBEYXRlKG5vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgMSkudG9JU09TdHJpbmcoKVxuICAgIGNvbnN0IHsgZGF0YTogaW50ZXJlc3RUeHMgfSA9IGF3YWl0IHN1cGFiYXNlQWRtaW5cbiAgICAgIC5mcm9tKCd0cmFuc2FjdGlvbnMnKVxuICAgICAgLnNlbGVjdCgnYW1vdW50LCBzdGF0dXMsIHR5cGUsIGNyZWF0ZWRfYXQnKVxuICAgICAgLmVxKCd0eXBlJywgJ2ludGVyZXN0JylcbiAgICAgIC5lcSgnc3RhdHVzJywgJ2NvbXBsZXRlZCcpXG4gICAgICAuZ3RlKCdjcmVhdGVkX2F0JywgbW9udGhTdGFydClcbiAgICBjb25zdCBtb250aGx5UmV2ZW51ZSA9IGludGVyZXN0VHhzPy5yZWR1Y2UoKHN1bSwgdCkgPT4gc3VtICsgKHQuYW1vdW50IHx8IDApLCAwKSB8fCAwXG5cbiAgICAvLyBDb252ZXJzaW9uIHJhdGUgKHBsYWNlaG9sZGVyOiB0b3RhbEN1c3RvbWVycyAvIDEwMCBmb3Igbm93KVxuICAgIGNvbnN0IGNvbnZlcnNpb25SYXRlID0gdG90YWxDdXN0b21lcnMgPyBNYXRoLnJvdW5kKCh0b3RhbEN1c3RvbWVycyAvIDEwMCkgKiAxMDAwKSAvIDEwIDogMFxuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHRvdGFsQ3VzdG9tZXJzLFxuICAgICAgdG90YWxWYWx1ZUxvY2tlZCxcbiAgICAgIGFjdGl2ZUphcnMsXG4gICAgICBhdmVyYWdlQXB5LFxuICAgICAgb3ZlcnZpZXcsXG4gICAgICByZWNlbnQsXG4gICAgICB0b3RhbEludmVzdGVkLFxuICAgICAgbW9udGhseVJldmVudWUsXG4gICAgICBjb252ZXJzaW9uUmF0ZSxcbiAgICB9KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRmFpbGVkIHRvIGxvYWQgZGFzaGJvYXJkIG1ldHJpY3MnIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgfVxufSAiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwic3VwYWJhc2VBZG1pbiIsIkdFVCIsImNvdW50IiwidG90YWxDdXN0b21lcnMiLCJmcm9tIiwic2VsZWN0IiwiaGVhZCIsImRhdGEiLCJqYXJWYWx1ZXMiLCJlcnJvciIsImphckVycm9yIiwidG90YWxWYWx1ZUxvY2tlZCIsInJlZHVjZSIsInN1bSIsImoiLCJjdXJyZW50X3ZhbHVlIiwiYWN0aXZlSmFycyIsImVxIiwiamFycyIsImphcnNFcnJvciIsImFweXMiLCJtYXAiLCJhcHkiLCJmaWx0ZXIiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImF2ZXJhZ2VBcHkiLCJsZW5ndGgiLCJhIiwiYiIsIm1vbnRobHkiLCJtb250aGx5RXJyb3IiLCJycGMiLCJvdmVydmlldyIsInJlY2VudCIsInJlY2VudEVycm9yIiwib3JkZXIiLCJhc2NlbmRpbmciLCJsaW1pdCIsImRlcG9zaXRUeHMiLCJ0b3RhbEludmVzdGVkIiwidCIsImFtb3VudCIsIm5vdyIsIkRhdGUiLCJtb250aFN0YXJ0IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInRvSVNPU3RyaW5nIiwiaW50ZXJlc3RUeHMiLCJndGUiLCJtb250aGx5UmV2ZW51ZSIsImNvbnZlcnNpb25SYXRlIiwiTWF0aCIsInJvdW5kIiwianNvbiIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/dashboard/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase/admin.ts":
/*!*******************************!*\
  !*** ./lib/supabase/admin.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\nconst supabaseUrl = \"https://rmyblssbxxoqmemfdupl.supabase.co\";\nconst supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;\nif (!supabaseUrl || !supabaseServiceRoleKey) {\n    throw new Error('Missing required Supabase environment variables');\n}\n// Create a Supabase client with service role key\nconst supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceRoleKey, {\n    auth: {\n        autoRefreshToken: true,\n        persistSession: true,\n        detectSessionInUrl: false\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UvYWRtaW4udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBb0Q7QUFFcEQsTUFBTUMsY0FBY0MsMENBQW9DO0FBQ3hELE1BQU1HLHlCQUF5QkgsUUFBUUMsR0FBRyxDQUFDRyx5QkFBeUI7QUFFcEUsSUFBSSxDQUFDTCxlQUFlLENBQUNJLHdCQUF3QjtJQUMzQyxNQUFNLElBQUlFLE1BQU07QUFDbEI7QUFFQSxpREFBaUQ7QUFDMUMsTUFBTUMsZ0JBQWdCUixtRUFBWUEsQ0FBQ0MsYUFBYUksd0JBQXdCO0lBQzdFSSxNQUFNO1FBQ0pDLGtCQUFrQjtRQUNsQkMsZ0JBQWdCO1FBQ2hCQyxvQkFBb0I7SUFDdEI7QUFDRixHQUFFIiwic291cmNlcyI6WyIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2xpYi9zdXBhYmFzZS9hZG1pbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMIVxuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlUm9sZUtleSA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVkhXG5cbmlmICghc3VwYWJhc2VVcmwgfHwgIXN1cGFiYXNlU2VydmljZVJvbGVLZXkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIFN1cGFiYXNlIGVudmlyb25tZW50IHZhcmlhYmxlcycpXG59XG5cbi8vIENyZWF0ZSBhIFN1cGFiYXNlIGNsaWVudCB3aXRoIHNlcnZpY2Ugcm9sZSBrZXlcbmV4cG9ydCBjb25zdCBzdXBhYmFzZUFkbWluID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZVNlcnZpY2VSb2xlS2V5LCB7XG4gIGF1dGg6IHtcbiAgICBhdXRvUmVmcmVzaFRva2VuOiB0cnVlLFxuICAgIHBlcnNpc3RTZXNzaW9uOiB0cnVlLFxuICAgIGRldGVjdFNlc3Npb25JblVybDogZmFsc2UsXG4gIH1cbn0pICJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJzdXBhYmFzZVNlcnZpY2VSb2xlS2V5IiwiU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSIsIkVycm9yIiwic3VwYWJhc2VBZG1pbiIsImF1dGgiLCJhdXRvUmVmcmVzaFRva2VuIiwicGVyc2lzdFNlc3Npb24iLCJkZXRlY3RTZXNzaW9uSW5VcmwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase/admin.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fdashboard%2Froute&page=%2Fapi%2Fadmin%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fdashboard%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fdashboard%2Froute&page=%2Fapi%2Fadmin%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fdashboard%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_obedkafflu_Documents_GitHub_seedclub_app_api_admin_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/dashboard/route.ts */ \"(rsc)/./app/api/admin/dashboard/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/dashboard/route\",\n        pathname: \"/api/admin/dashboard\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/dashboard/route\"\n    },\n    resolvedPagePath: \"/Users/obedkafflu/Documents/GitHub/seedclub/app/api/admin/dashboard/route.ts\",\n    nextConfigOutput,\n    userland: _Users_obedkafflu_Documents_GitHub_seedclub_app_api_admin_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRmRhc2hib2FyZCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYWRtaW4lMkZkYXNoYm9hcmQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhZG1pbiUyRmRhc2hib2FyZCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm9iZWRrYWZmbHUlMkZEb2N1bWVudHMlMkZHaXRIdWIlMkZzZWVkY2x1YiUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZvYmVka2FmZmx1JTJGRG9jdW1lbnRzJTJGR2l0SHViJTJGc2VlZGNsdWImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQzRCO0FBQ3pHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvb2JlZGthZmZsdS9Eb2N1bWVudHMvR2l0SHViL3NlZWRjbHViL2FwcC9hcGkvYWRtaW4vZGFzaGJvYXJkL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hZG1pbi9kYXNoYm9hcmQvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hZG1pbi9kYXNoYm9hcmRcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2FkbWluL2Rhc2hib2FyZC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9vYmVka2FmZmx1L0RvY3VtZW50cy9HaXRIdWIvc2VlZGNsdWIvYXBwL2FwaS9hZG1pbi9kYXNoYm9hcmQvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fdashboard%2Froute&page=%2Fapi%2Fadmin%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fdashboard%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fadmin%2Fdashboard%2Froute&page=%2Fapi%2Fadmin%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fdashboard%2Froute.ts&appDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fobedkafflu%2FDocuments%2FGitHub%2Fseedclub&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();