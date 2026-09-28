CC = nvcc
BIN = bin

all: $(BIN)/alpha.dger $(BIN)/lda.dger $(BIN)/dger $(BIN)/stride.dger

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.dger: alpha.dger.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.dger.c -o $(BIN)/alpha.dger -lcublas

$(BIN)/lda.dger: lda.dger.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.dger.c -o $(BIN)/lda.dger -lcublas

$(BIN)/dger: dger.c ../../utils/helpers.h | $(BIN)
	$(CC) dger.c -o $(BIN)/dger -lcublas

$(BIN)/stride.dger: stride.dger.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dger.c -o $(BIN)/stride.dger -lcublas

clean:
	rm -rf $(BIN)
