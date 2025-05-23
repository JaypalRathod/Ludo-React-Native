import {
    createNavigationContainerRef,
    CommonActions,
    StackActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export async function navigate(routeName, params) {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.navigate(routeName, params));
    }
}

export async function resetAndNavigate(routeName) {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: routeName }],
            }),
        );
    }
}

export async function goBack() {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.goBack());
    }
}

export async function replace(routeName, params) {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(routeName, params));
    }
}

export async function push(routeName, params) {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.push(routeName, params));
    }
}

export async function prepareNavigation() {
    await navigationRef.isReady();
}
