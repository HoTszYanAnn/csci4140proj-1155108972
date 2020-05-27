#include <stdio.h>
#include <math.h>
#include <limits.h>
#include <time.h>
#include <stdlib.h>
#define win_score 10
#define t 20
#define loops 200

typedef struct node {
	int state;
	int *board;
	int visits;
	int player;
	double score;
	struct node *parent;
	struct node **childarray;
} node;

int check(int *board, int n, int d, int k);
int checkboard(int *board, int n, int d, int k, int num, int a[], int p[]);
int checkline(int *board, int n, int d, int k, int num, int a[], int p[], int q[]);
int win(int *block, int k);
void printboard(int *board, int n, int d);
int *findnextmove(int *board, int player, int n, int d, int k, int p);
double fuct (node *root);
node *findbestmove_uct(node *root, int n, int d);
node *selectpromisingnode(node *root, int n, int d);
void expandnode(node *root, int player, int n, int d, int k, int p);
int simulate(node *root, int player, int n, int d, int k, int p);
void backpropogate(node *root, int player);

int main() {
	int j, player[loops], moves[loops], winner[loops];
	char name[10];
	for (int d = 2; d <= 2; d++) {
		sprintf(name, "mcts_%d_t.txt", d);
		FILE *file = fopen(name, "w");
		fprintf(file, "d\tp\tn\tk\twinner\n");
		for (int p = 2; p <= d; p++) {
			for (int n = 4; n <= 9; n++) {
				for (int k = 3; k <= n; k++) {
					int **board;
					board = (int **)malloc(loops * sizeof(int *));
					for (int i = 0; i < loops; i++) board[i] = malloc((int)pow(n, d) * sizeof(int));
					#pragma omp parallel for schedule(dynamic, 1)
					for (int run = 0; run < loops; run++) {
						winner[run] = 0;
						for (int i = 0; i < pow(n, d); i++) board[run][i] = 0;
						srand(time(NULL));
						moves[run] = 0;
						player[run] = p;
						while (winner[run] == 0 && moves[run] < pow(n, d)) {
							board[run] = findnextmove(board[run], player[run], n, d, k, p);
							printf("%d\t%d\n", run, moves[run] + 1);
							printboard(board[run], n, d);
							winner[run] = check(board[run], n, d, k);
							player[run]++;
							if (player[run] > p) player[run] = 1;
							moves[run]++;
						}
						printf("%d\t%d\n", run, winner[run]);
						fprintf(file, "%d\t%d\t%d\t%d\t%d\n", d, p, n, k, winner[run]);
					}
				}
			}
		}
		fclose(file);
	}
	return 0;
}

int check(int *board, int n, int d, int k) {
	int i, a[d], p[d], num, num0, winner;
	for (num = 1; num < pow(2, d); num++) {
		num0 = num;
		for (i = 0; i < d; i++) a[i] = 0;
		for (i = 0; i < d; i++) {
			if (num0 >= pow(2, d - i - 1)) {
				p[i] = 1;
				num0 -= pow(2, d - i - 1);
			} else p[i] = 0;
		}
		for (i = 0; i < d; i++) num0 += p[i];
		num0 = d - num0;
		winner = checkboard(board, n, d, k, num0, a, p);
		if (winner != 0) return winner;
	}
	return 0;
}

int checkboard(int *board, int n, int d, int k, int num, int a[], int p[]) {
	int i, j, m, count0 = 0, winner;
	if (num > 1) {
		for (j = 0; j < d; j++) {
				if (p[j] == 0) count0++;
				if (count0 == num) break;
		}
		for (i = 0; i < n; i++) {
			winner = checkboard(board, n, d, k, num - 1, a, p);
			if (winner != 0) return winner;
			for (m = 0; m < j; m++) if (p[m] == 0) a[m] = 0;
			a[j]++;
		}
	}
	else {
		int i_k, i_nk, i_n, moving, block[k], pos, moving_exist, variables, num0;
		for (moving = 0; moving < d; moving++) {
			if (p[moving] == 0) {
				moving_exist = 1;
				break;
			}
		}
		if (moving_exist == 1) a[moving] = 0;
		variables = 0;
		for (i = 0; i < d; i++) variables += p[i];
		if (variables < 2) {
			for (i_n = 0; i_n < n; i_n++) {
				for (i_nk = 0; i_nk < n - k + 1; i_nk++) {
					for (i_k = 0; i_k < k; i_k++) {
						pos = 0;
						for (j = 0; j < d; j++) {
							if (p[j] == 1) a[j] = i_nk + i_k;
						}
						for (j = 0; j < d; j++) pos += a[j] * pow(n, j);
						block[i_k] = board[pos];
						//printf("%d\t", pos);
					}
					//printf("\n");
					winner = win(block, k);
					if (winner != 0) return winner;
				}
				if (moving_exist == 1) a[moving]++;
			}
		} else if (num == 0) {
			int q[d];
			for (i = 0; i < pow(2, variables - 1); i++) {
				num0 = i;
				for (j = 0; j < d; j++) {
					if (p[j] == 1) {
						if (num0 >= pow(2, variables - j - 1)) {
							q[j] = 1;
							num0 -= pow(2, variables - j - 1);
						} else q[j] = 0;
					} else q[j] = 0;
				}
				for (j = 0; j < d; j++) if (p[j] == 1) q[j] = q[j] * 2 - 1;
				winner = checkline(board, n, d, k, variables, a, p, q);
				if (winner != 0) return winner;
			}
		} else if (num == 1) {
			int q[d];
			for (i_n = 0; i_n < n; i_n++) {
				for (i = 1; i <= pow(2, variables - 1); i++) {
					num0 = i;
					for (j = 0; j < d; j++) {
						if (p[j] == 1) {
							if (num0 >= pow(2, variables - j - 1)) {
								q[j] = 1;
								num0 -= pow(2, variables - j - 1);
							} else q[j] = 0;
						} else q[j] = 0;
					}
					for (j = 0; j < d; j++) if (p[j] == 1) q[j] = q[j] * 2 - 1;
					winner = checkline(board, n, d, k, variables, a, p, q);
					if (winner != 0) {
						return winner;
					}
				}
				if (moving_exist == 1) a[moving]++;
			}
		}
	}
	return 0;
}

int checkline(int *board, int n, int d, int k, int num, int a[], int p[], int q[]) {
	int i, j, count1 = 0, winner;
	if (num > 1) {
		for (j = 0; j < d; j++) {
				if (p[j] == 1) count1++;
				if (p[j] == 1 && count1 == num) break;
		}
		a[j] = 0;
		for (i = 0; i < n - k + 1; i++) {
			winner = checkline(board, n, d, k, num - 1, a, p, q);
			if (winner != 0) return winner;
			a[j]++;
		}
	}
	else {
		int i_k, i_nk, i_n, moving1, block[k], pos, countq, b[d], counta;
		for (moving1 = 0; moving1 < d; moving1++) {
			if (p[moving1] == 1) {
				break;
			}
		}
		a[moving1] = 0;
		counta = 0;
		for (j = 0; j < d; j++) {if (j != moving1 && p[j] == 1) counta += a[j];}
		for (i_nk = 0; i_nk < n - k + 1; i_nk++) {
			//for (j = 0; j < d; j++) if (p[j] == 1) printf("%d\t", q[j]);
			//printf("\n");
			for (j = 0; j < d; j++) {
				if (j != moving1) {
					if (p[j] == 1 && q[j] > 0) b[j] = a[j];
					else if (p[j] == 1 && q[j] < 0) b[j] = k + a[j] - 1;
					else b[j] = a[j];
				} else b[j] = i_nk;
			}
			for (i_k = 0; i_k < k; i_k++) {
				pos = 0;
				for (j = 0; j < d; j++) pos += b[j] * pow(n, j);
				block[i_k] = board[pos];
				for (j = 0; j < d; j++) {
					if (p[j] == 1) {
						if (j != moving1) b[j] += q[j];
						else b[j]++;
					}
				}
				//printf("%d\t", pos);
			}
			//printf("\n");
			winner = win(block, k);
			if (winner != 0) return winner;
			a[moving1]++;
		}
	}
	return 0;
}

int win(int *block, int k) {
	int i;
	for (i = 1; i < k; i++) {
		if (block[i] != block[i-1]) return 0;
	}
	return block[0];
}

void printboard(int *board, int n, int d) {
	int i, j, p;
	if (d == 2) {
		for (i = 0; i < n; i++) {
			for (j = 0; j < n; j++) {
				p = board[(n - i - 1) * n + j];
				if (p != 0) printf("%d ", p);
				else printf("- ");
			}
			printf("\n");
		}
	printf("\n");
	}
}

int *findnextmove(int *board, int player, int n, int d, int k, int p) {
	int j, random, winner, max[2], empty;
	node *tree;
	tree = malloc(sizeof(node));
	tree->parent = NULL;
	tree->childarray = NULL;
	tree->board = malloc((int)pow(n, d) * sizeof(int));
	tree->score = 0;
	tree->player = player;
	//if (tree->player > p) tree->player = 1;
	tree->visits = 0;
	for (int i = 0; i < pow(n, d); i++) tree->board[i] = board[i];
	tree->state = check(tree->board, n, d, k);
	clock_t period = t * CLOCKS_PER_SEC;
	clock_t start = clock();
	node *promisingnode = malloc(sizeof(node)), *node_exploring = malloc(sizeof(node));
	promisingnode->board = malloc((int)pow(n, d) * sizeof(int));
	int max_moves = 200000 * ((double)(pow(n,d) * k * p) / (double)(pow(3,2) * 3 * 2));
	for (int i = 0; i < max_moves; i++) {
		//Selection
		promisingnode = selectpromisingnode(tree, n, d);
		
		//Expansion
		if (promisingnode->state == 0) expandnode(promisingnode, promisingnode->player, n, d, k, p);
		
		//Simulation
		empty = 0;
		for (j = 0; j < pow(n, d); j++) if (promisingnode->board[j] == 0) empty++;
		if (empty != 0 && promisingnode->childarray != NULL) {
			random = rand() % empty;
			node_exploring = promisingnode->childarray[random];
		} else node_exploring = promisingnode;
		winner = simulate(node_exploring, node_exploring->player, n, d, k, p);
		
		//Update
		backpropogate(node_exploring, winner);
	}
	max[0] = 0;
	max[1] = 0;
	empty = 0;
	for (int i = 0; i < pow(n, d); i++) if (tree->board[i] == 0) empty++;	
	for (int i = 0; i < empty; i++) {
		if (tree->childarray[i]->visits > max[1]) {
			max[0] = i;
			max[1] = tree->childarray[i]->visits;
		}
	}
	tree = tree->childarray[max[0]];
	free(promisingnode);
	return tree->board;
}

double fuct (node *root) {
	int visits = root->parent->visits;
	double win_score_node = root->score;
	int visits_node = root->visits;
	if (visits_node == 0) return INT_MAX;
	return ((double)(win_score_node) / (double)(visits_node) + sqrt(2.0) * sqrt(log((double)visits)) / sqrt((double)visits_node));
}


node *findbestmove_uct(node *root, int n, int d) {
	int i, max, empty = 0;
	double max_uct, uct;
	max = 0;
	max_uct = 0;
	for (i = 0; i < pow(n, d); i++) if (root->board[i] == 0) empty++;
	for (i = 0; i < empty; i++) {
		uct = fuct(root->childarray[i]);
		if (uct > max_uct) {
			max = i;
			max_uct = uct;
		}
		//printf("%f\n", uct);
	}
	//printf("%f\n\n", max_uct);
	return root->childarray[max];
}

node *selectpromisingnode(node *root, int n, int d) {
	node *temp = root;
	while(temp->childarray != NULL) {
		if (temp->childarray[0] == NULL) break;
		temp = findbestmove_uct(temp, n, d);
	}
	return temp;
}

void expandnode(node *root, int player, int n, int d, int k, int p) {
	int i, j, empty = 0;
	player++;
	if (player > p) player = 1;
	for (i = 0; i < pow(n, d); i++) {
		if (root->board[i] == 0) empty++;
	}
	if (empty != 0) {
		root->childarray = (node **)malloc(empty * sizeof(int *));
		for (i = 0; i < empty; i++) {
			root->childarray[i] = malloc(sizeof(node));
			root->childarray[i]->board = malloc((int)pow(n ,d) * sizeof(int));
			for (j = 0; j < pow(n, d); j++) root->childarray[i]->board[j] = root->board[j];
		}
		empty = 0;
		for (i = 0; i < pow(n, d); i++) {
			if (root->board[i] == 0) {
				root->childarray[empty]->parent = root;
				root->childarray[empty]->childarray = NULL;
				root->childarray[empty]->board[i] = player;
				root->childarray[empty]->state = check(root->childarray[empty]->board, n, d, k);
				root->childarray[empty]->score = 0;
				root->childarray[empty]->visits = 0;
				root->childarray[empty]->player = player;
				/*if (player < p) root->childarray[empty]->player = player + 1;
				else root->childarray[empty]->player = 1;*/
				empty++;
			}
		}
	}
}

int simulate(node *root, int player, int n, int d, int k, int p) {
	node *temp;
	int i, random, empty, emptylist[(int)pow(n, d)];
	temp = malloc(sizeof(node));
	temp->board = malloc((int)pow(n, d) * sizeof(int));
	for (i = 0; i < pow(n, d); i++) temp->board[i] = root->board[i];
	temp->state = check(temp->board, n, d, k);
	if (temp->state != 0 && temp->state == player) {
		root->parent->score = INT_MIN;
		return temp->state;
	}
	empty = 0;
	for (i = 0; i < pow(n, d); i++) {
		if (temp->board[i] == 0) {
			emptylist[empty] = i;
			empty++;
		}
	}
	while (temp->state == 0 && empty > 0) {
		temp->board[emptylist[rand()%empty]] = player;
		temp->state = check(temp->board, n, d, k);
		empty = 0;
		for (i = 0; i < pow(n, d); i++) {
			if (temp->board[i] == 0) {
				emptylist[empty] = i;
				empty++;
			}
		}
		player++;
		if (player > p) player = 1;
	}
	return temp->state;
}

void backpropogate(node *root, int player) {
	node *temp = root;
	while (temp != NULL) {
		temp->visits++;
		if (temp->player == player && temp->score != INT_MIN) temp->score += win_score;
		temp = temp->parent;
	}
}
